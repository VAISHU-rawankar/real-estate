'use strict';

const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const s3Client = require('../config/aws');
const logger = require('../utils/logger');
const { IMAGE_MAX_WIDTH, THUMBNAIL_WIDTH, IMAGE_QUALITY } = require('../utils/constants');

const BUCKET = process.env.AWS_S3_BUCKET;
const CDN = process.env.CLOUDFRONT_DOMAIN;

/**
 * Upload a single image to S3.
 * Compresses with Sharp → WebP, max IMAGE_MAX_WIDTH px width.
 * Also generates a thumbnail at THUMBNAIL_WIDTH px.
 *
 * @param {Buffer} fileBuffer - Raw file buffer from multer memoryStorage
 * @param {string} folder     - S3 folder (e.g., 'property-images/prop-id')
 * @returns {Promise<{url, thumbnailUrl}>}
 */
async function uploadImage(fileBuffer, folder) {
  const id = uuidv4();
  const key = `${folder}/${id}.webp`;
  const thumbKey = `${folder}/${id}-thumb.webp`;

  // Compress main image
  const compressed = await sharp(fileBuffer)
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();

  // Generate thumbnail
  const thumbnail = await sharp(fileBuffer)
    .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();

  await Promise.all([
    s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: compressed,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000',
    })),
    s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: thumbKey,
      Body: thumbnail,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000',
    })),
  ]);

  return {
    url: `${CDN}/${key}`,
    thumbnailUrl: `${CDN}/${thumbKey}`,
  };
}

async function uploadImages(fileBuffers, folder) {
  return Promise.all(fileBuffers.map((buf) => uploadImage(buf, folder)));
}

/**
 * Upload any file (video, doc, etc.) without processing.
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimetype
 * @param {string} folder
 */
async function uploadFile(fileBuffer, originalName, mimetype, folder) {
  const ext = originalName.split('.').pop();
  const key = `${folder}/${uuidv4()}.${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
    CacheControl: 'public, max-age=31536000',
  }));

  return {
    url: `${CDN}/${key}`,
    name: originalName,
    mimetype,
  };
}

/**
 * Delete an image from S3 by its CDN URL.
 * @param {string} imageUrl - Full CloudFront URL
 */
async function deleteImage(imageUrl) {
  try {
    const key = imageUrl.replace(`${CDN}/`, '');
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    // Also delete thumbnail
    const thumbKey = key.replace('.webp', '-thumb.webp');
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: thumbKey }));
  } catch (err) {
    logger.error(`S3 delete failed for ${imageUrl}: ${err.message}`);
  }
}

/**
 * Generate a pre-signed URL for private S3 object access.
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Seconds until expiry (default 1 hour)
 * @returns {Promise<string>} pre-signed URL
 */
async function generatePresignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
}

module.exports = { uploadImage, uploadImages, uploadFile, deleteImage, generatePresignedUrl };
