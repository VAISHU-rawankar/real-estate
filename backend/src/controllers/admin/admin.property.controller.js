'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const propertyService = require('../../services/property.service');
const s3Service = require('../../services/s3.service');
const Property = require('../../models/Property.model');
const buildPagination = require('../../utils/pagination');

/**
 * GET /api/v1/admin/properties
 */
const getAdminProperties = asyncHandler(async (req, res) => {
  const { page, limit, skip, buildMeta } = buildPagination(req.query);
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.propertyType) query.propertyType = req.query.propertyType;
  if (req.query.city) query['location.city'] = new RegExp(req.query.city, 'i');

  const [properties, total] = await Promise.all([
    Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title slug status price location propertyType isFeatured images createdAt viewCount enquiryCount')
      .lean({ virtuals: true }),
    Property.countDocuments(query),
  ]);

  sendSuccess(res, { data: properties, meta: buildMeta(total) });
});

/**
 * POST /api/v1/admin/properties
 */
const createProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.createProperty(req.user._id, req.validatedBody);
  sendSuccess(res, { status: 201, data: property, message: 'Property created successfully' });
});

/**
 * GET /api/v1/admin/properties/:id
 */
const getAdminPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('createdBy', 'name email')
    .lean({ virtuals: true });

  if (!property) return sendError(res, { status: 404, message: 'Property not found', code: 'NOT_FOUND' });
  sendSuccess(res, { data: property });
});

/**
 * PUT /api/v1/admin/properties/:id
 */
const updateProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.updateProperty(req.params.id, req.body);
  sendSuccess(res, { data: property, message: 'Property updated' });
});

/**
 * DELETE /api/v1/admin/properties/:id
 */
const deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deleteProperty(req.params.id);
  sendSuccess(res, { message: 'Property archived successfully' });
});

/**
 * PATCH /api/v1/admin/properties/:id/status
 */
const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['active', 'draft', 'sold', 'rented', 'archived'];
  if (!validStatuses.includes(status)) {
    return sendError(res, { status: 400, message: 'Invalid status', code: 'INVALID_STATUS' });
  }

  const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!property) return sendError(res, { status: 404, message: 'Property not found', code: 'NOT_FOUND' });

  sendSuccess(res, { data: property, message: `Status updated to ${status}` });
});

/**
 * PATCH /api/v1/admin/properties/:id/featured
 */
const toggleFeatured = asyncHandler(async (req, res) => {
  const property = await propertyService.toggleFeatured(req.params.id);
  sendSuccess(res, { data: property, message: `Featured ${property.isFeatured ? 'enabled' : 'disabled'}` });
});

/**
 * POST /api/v1/admin/properties/:id/images
 */
const uploadPropertyImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, { status: 400, message: 'No images uploaded', code: 'NO_FILES' });
  }

  const folder = `property-images/${req.params.id}`;
  const uploaded = await s3Service.uploadImages(
    req.files.map((f) => f.buffer),
    folder
  );

  const imageObjects = uploaded.map((img, i) => ({
    url: img.url,
    thumbnailUrl: img.thumbnailUrl,
    isPrimary: i === 0,
    order: i,
  }));

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: imageObjects } } },
    { new: true }
  );

  if (!property) return sendError(res, { status: 404, message: 'Property not found', code: 'NOT_FOUND' });
  sendSuccess(res, { data: property.images, message: `${uploaded.length} image(s) uploaded` });
});

/**
 * DELETE /api/v1/admin/properties/:id/images/:imageId
 */
const deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return sendError(res, { status: 404, message: 'Property not found', code: 'NOT_FOUND' });

  const image = property.images.id(req.params.imageId);
  if (!image) return sendError(res, { status: 404, message: 'Image not found', code: 'NOT_FOUND' });

  // Delete from S3
  await s3Service.deleteImage(image.url);

  property.images.pull(req.params.imageId);
  await property.save();

  sendSuccess(res, { message: 'Image deleted' });
});

/**
 * PATCH /api/v1/admin/properties/:id/images/reorder
 */
const reorderImages = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;
  const property = await Property.findById(req.params.id);
  if (!property) return sendError(res, { status: 404, message: 'Property not found', code: 'NOT_FOUND' });

  orderedIds.forEach((id, index) => {
    const img = property.images.id(id);
    if (img) {
      img.order = index;
      img.isPrimary = index === 0;
    }
  });

  property.images.sort((a, b) => a.order - b.order);
  await property.save();

  sendSuccess(res, { data: property.images, message: 'Images reordered' });
});

module.exports = {
  getAdminProperties,
  createProperty,
  getAdminPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  toggleFeatured,
  uploadPropertyImages,
  deletePropertyImage,
  reorderImages,
};
