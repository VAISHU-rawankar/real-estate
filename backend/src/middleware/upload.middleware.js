'use strict';

const multer = require('multer');
const path = require('path');
const { ALLOWED_MIME_TYPES, MAX_IMAGE_SIZE_MB, MAX_IMAGES_PER_PROPERTY } = require('../utils/constants');
const { sendError } = require('../utils/apiResponse');

const MAX_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// ─── Memory storage (files processed by Sharp before S3 upload) ───────────────
const storage = multer.memoryStorage();

/**
 * File filter — validates MIME type on the server (not just extension).
 */
function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP`), {
        code: 'INVALID_FILE_TYPE',
        statusCode: 400,
      }),
      false
    );
  }
}

/**
 * Single image upload middleware.
 */
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
}).single('image');

/**
 * Multiple images upload middleware (up to MAX_IMAGES_PER_PROPERTY).
 */
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES, files: MAX_IMAGES_PER_PROPERTY },
}).array('images', MAX_IMAGES_PER_PROPERTY);

/**
 * Wrap multer middleware to convert errors to our standard API error format.
 */
function wrapMulter(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, { status: 400, message: `File too large. Max ${MAX_IMAGE_SIZE_MB}MB per image.`, code: 'FILE_TOO_LARGE' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return sendError(res, { status: 400, message: `Too many files. Max ${MAX_IMAGES_PER_PROPERTY} images.`, code: 'TOO_MANY_FILES' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return sendError(res, { status: 400, message: err.message, code: 'INVALID_FILE_TYPE' });
      }

      next(err);
    });
  };
}

module.exports = {
  uploadSingle: wrapMulter(uploadSingle),
  uploadMultiple: wrapMulter(uploadMultiple),
};
