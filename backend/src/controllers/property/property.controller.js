'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const propertyService = require('../../services/property.service');
const { CACHE_TTL } = require('../../utils/constants');

/**
 * GET /api/v1/properties
 * Full filter support via query params.
 */
const getProperties = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query;
  const { properties, meta } = await propertyService.searchProperties(filters, { page, limit, sort });
  sendSuccess(res, { data: properties, meta, message: 'Properties fetched' });
});

/**
 * GET /api/v1/properties/featured
 */
const getFeaturedProperties = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const properties = await propertyService.getFeaturedProperties(limit);
  sendSuccess(res, { data: properties, message: 'Featured properties fetched' });
});

/**
 * GET /api/v1/properties/suggestions
 */
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const suggestions = await propertyService.getSearchSuggestions(keyword);
  sendSuccess(res, { data: suggestions });
});

/**
 * GET /api/v1/properties/:slug
 */
const getPropertyBySlug = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyBySlug(req.params.slug);
  sendSuccess(res, { data: property, message: 'Property fetched' });
});

/**
 * GET /api/v1/properties/:slug/related
 */
const getRelatedProperties = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyBySlug(req.params.slug, false);
  const related = await propertyService.getRelatedProperties(property, 6);
  sendSuccess(res, { data: related, message: 'Related properties fetched' });
});

module.exports = {
  getProperties,
  getFeaturedProperties,
  getSearchSuggestions,
  getPropertyBySlug,
  getRelatedProperties,
};
