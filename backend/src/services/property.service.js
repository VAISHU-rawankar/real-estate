'use strict';

const Property = require('../models/Property.model');
const { geocodeAddress } = require('./geocoding.service');
const { deleteImage } = require('./s3.service');
const { invalidateCache } = require('../middleware/cache.middleware');
const buildPagination = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Create a new property listing.
 * @param {string} adminId
 * @param {Object} data - Validated property data
 * @returns {Promise<Property>}
 */
async function createProperty(adminId, data) {
  // Geocode address to coordinates
  if (data.location && data.location.address) {
    try {
      const addressStr = `${data.location.address}, ${data.location.city}, ${data.location.state}`;
      const coords = await geocodeAddress(addressStr);
      if (coords) {
        data.location.coordinates = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat],
        };
      }
    } catch (err) {
      logger.warn(`Geocoding failed for property: ${err.message}`);
    }
  }

  const property = await Property.create({ ...data, createdBy: adminId });

  // Bust property search caches
  await invalidateCache('cache:*');

  return property;
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Partially update a property.
 * @param {string} propertyId
 * @param {Object} updateData
 * @returns {Promise<Property>}
 */
async function updateProperty(propertyId, updateData) {
  // Re-geocode if address changed
  if (updateData.location?.address) {
    try {
      const addressStr = `${updateData.location.address}, ${updateData.location.city}, ${updateData.location.state}`;
      const coords = await geocodeAddress(addressStr);
      if (coords) {
        if (!updateData.location) updateData.location = {};
        updateData.location.coordinates = { type: 'Point', coordinates: [coords.lng, coords.lat] };
      }
    } catch (err) {
      logger.warn(`Re-geocoding failed on update: ${err.message}`);
    }
  }

  const property = await Property.findByIdAndUpdate(
    propertyId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!property) {
    throw Object.assign(new Error('Property not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  await invalidateCache('cache:*');
  return property;
}

// ─── Soft Delete ──────────────────────────────────────────────────────────────

/**
 * Soft-delete a property (status → 'archived'). NOT a hard delete.
 * @param {string} propertyId
 */
async function deleteProperty(propertyId) {
  const property = await Property.findByIdAndUpdate(
    propertyId,
    { status: 'archived', isFeatured: false },
    { new: true }
  );

  if (!property) {
    throw Object.assign(new Error('Property not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  await invalidateCache('cache:*');
  return property;
}

// ─── Get by Slug ──────────────────────────────────────────────────────────────

/**
 * Fetch a property by its URL slug.
 * Increments viewCount on each fetch (unless disabled).
 * @param {string} slug
 * @param {boolean} incrementView
 * @returns {Promise<Object>}
 */
async function getPropertyBySlug(slug, incrementView = true) {
  const update = incrementView ? { $inc: { viewCount: 1 } } : {};
  const property = await Property.findOneAndUpdate(
    { slug, status: { $in: ['active', 'featured'] } },
    update,
    { new: true }
  )
    .populate('createdBy', 'name email phone')
    .lean({ virtuals: true });

  if (!property) {
    throw Object.assign(new Error('Property not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  return property;
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Advanced property search with full filter support.
 * @param {Object} filters - All search/filter params
 * @param {Object} query   - req.query for pagination and sort
 * @returns {Promise<{properties, total, pages, currentPage}>}
 */
async function searchProperties(filters, query) {
  const { page, limit, skip, buildMeta } = buildPagination(query);
  const sort = buildSortOption(query.sort);

  // Build query
  const mongoQuery = buildSearchQuery(filters);

  // If keyword provided, use text index
  if (filters.keyword) {
    mongoQuery.$text = { $search: filters.keyword };
  }

  // Geospatial search
  let pipeline = null;
  if (filters.lat && filters.lng && filters.radius) {
    pipeline = buildGeospatialPipeline(filters, mongoQuery, sort, skip, limit);
  }

  let properties, total;

  if (pipeline) {
    const result = await Property.aggregate(pipeline);
    total = result[0]?.total[0]?.count || 0;
    properties = result[0]?.properties || [];
  } else {
    [properties, total] = await Promise.all([
      Property.find(mongoQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-description') // Exclude long text from list view
        .lean({ virtuals: true }),
      Property.countDocuments(mongoQuery),
    ]);
  }

  return { properties, meta: buildMeta(total) };
}

function buildSearchQuery(filters) {
  const q = { status: { $in: ['active', 'featured'] } };

  if (filters.city) q['location.city'] = new RegExp(filters.city, 'i');
  if (filters.locality) q['location.locality'] = new RegExp(filters.locality, 'i');
  if (filters.propertyType) q.propertyType = filters.propertyType;
  if (filters.propertySubType) q.propertySubType = filters.propertySubType;
  if (filters.listingType) q.listingType = filters.listingType;
  if (filters.bhkConfig) {
    const bhks = Array.isArray(filters.bhkConfig) ? filters.bhkConfig : [filters.bhkConfig];
    q.bhkConfig = { $in: bhks };
  }
  if (filters.furnishingStatus) q.furnishingStatus = filters.furnishingStatus;
  if (filters.possessionStatus) q.possessionStatus = filters.possessionStatus;
  if (filters.facing) q.facing = filters.facing;
  if (filters.ageOfProperty) q.ageOfProperty = filters.ageOfProperty;
  if (filters.parking) q.parking = filters.parking;
  if (filters.reraApproved === 'true' || filters.reraApproved === true) q.reraApproved = true;

  // Price range
  if (filters.priceMin || filters.priceMax) {
    q.price = {};
    if (filters.priceMin) q.price.$gte = Number(filters.priceMin);
    if (filters.priceMax) q.price.$lte = Number(filters.priceMax);
  }

  // Area range
  if (filters.areaMin || filters.areaMax) {
    q.carpetArea = {};
    if (filters.areaMin) q.carpetArea.$gte = Number(filters.areaMin);
    if (filters.areaMax) q.carpetArea.$lte = Number(filters.areaMax);
  }

  // Amenities (all must match)
  if (filters.amenities) {
    const amenityList = Array.isArray(filters.amenities)
      ? filters.amenities
      : filters.amenities.split(',');
    q.societyAmenities = { $all: amenityList };
  }

  // Floor range
  if (filters.floorMin || filters.floorMax) {
    q.floorNumber = {};
    if (filters.floorMin) q.floorNumber.$gte = Number(filters.floorMin);
    if (filters.floorMax) q.floorNumber.$lte = Number(filters.floorMax);
  }

  return q;
}

function buildSortOption(sortParam) {
  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'most-relevant': { score: { $meta: 'textScore' } },
    'most-viewed': { viewCount: -1 },
  };
  return sortMap[sortParam] || { createdAt: -1 };
}

function buildGeospatialPipeline(filters, matchQuery, sort, skip, limit) {
  return [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(filters.lng), parseFloat(filters.lat)],
        },
        distanceField: 'distance',
        maxDistance: (parseFloat(filters.radius) || 10) * 1000, // km to meters
        spherical: true,
        query: matchQuery,
      },
    },
    {
      $facet: {
        properties: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  ];
}

// ─── Featured ─────────────────────────────────────────────────────────────────

/**
 * Get featured properties for the homepage.
 * @param {number} limit
 * @returns {Promise<Property[]>}
 */
async function getFeaturedProperties(limit = 8) {
  return Property.find({ status: { $in: ['active', 'featured'] }, isFeatured: true })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('title slug price location bhkConfig carpetArea images status isFeatured propertyType')
    .lean({ virtuals: true });
}

// ─── Related ──────────────────────────────────────────────────────────────────

/**
 * Get related properties (same city + type).
 * @param {Property} property
 * @param {number} limit
 * @returns {Promise<Property[]>}
 */
async function getRelatedProperties(property, limit = 6) {
  return Property.find({
    _id: { $ne: property._id },
    'location.city': property.location.city,
    propertyType: property.propertyType,
    status: { $in: ['active', 'featured'] },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug price location bhkConfig carpetArea images propertyType')
    .lean({ virtuals: true });
}

// ─── Toggle Featured ──────────────────────────────────────────────────────────

/**
 * Toggle the isFeatured flag on a property.
 * @param {string} propertyId
 * @returns {Promise<Property>}
 */
async function toggleFeatured(propertyId) {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw Object.assign(new Error('Property not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  property.isFeatured = !property.isFeatured;
  if (property.isFeatured && property.status === 'draft') {
    property.status = 'active';
  }

  await property.save();
  await invalidateCache('cache:*');

  return property;
}

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────

/**
 * Aggregate dashboard KPI metrics.
 * @returns {Promise<Object>}
 */
async function getDashboardStats() {
  const [statusCounts, featuredCount, allProperties] = await Promise.all([
    Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Property.countDocuments({ isFeatured: true }),
    Property.find().select('images floorPlanImages').lean(),
  ]);

  const stats = statusCounts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  let totalImages = 0;
  allProperties.forEach((p) => {
    if (p.images) totalImages += p.images.length;
    if (p.floorPlanImages) totalImages += p.floorPlanImages.length;
  });
  const mediaStorageUsed = Math.max(0.01, (totalImages * 350 * 1024) / (1024 * 1024 * 1024));

  return {
    total: Object.values(stats).reduce((a, b) => a + b, 0),
    active: (stats.active || 0) + (stats.featured || 0),
    draft: stats.draft || 0,
    sold: stats.sold || 0,
    rented: stats.rented || 0,
    archived: stats.archived || 0,
    featured: featuredCount,
    mediaStorageUsed: parseFloat(mediaStorageUsed.toFixed(3)),
  };
}

// ─── Search Suggestions ───────────────────────────────────────────────────────

/**
 * Autocomplete suggestions based on keyword.
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
async function getSearchSuggestions(keyword) {
  if (!keyword || keyword.length < 2) return [];

  const regex = new RegExp(keyword, 'i');

  const results = await Property.aggregate([
    {
      $match: {
        status: { $in: ['active', 'featured'] },
        $or: [
          { 'location.city': regex },
          { 'location.locality': regex },
          { projectName: regex },
          { title: regex },
        ],
      },
    },
    {
      $group: {
        _id: null,
        cities: { $addToSet: '$location.city' },
        localities: { $addToSet: '$location.locality' },
        projects: { $addToSet: '$projectName' },
      },
    },
    { $limit: 1 },
  ]);

  if (!results.length) return [];

  const { cities = [], localities = [], projects = [] } = results[0];

  return [
    ...cities.filter(Boolean).map((c) => ({ type: 'city', label: c })),
    ...localities.filter(Boolean).map((l) => ({ type: 'locality', label: l })),
    ...projects.filter(Boolean).map((p) => ({ type: 'project', label: p })),
  ].slice(0, 10);
}

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBySlug,
  searchProperties,
  getFeaturedProperties,
  getRelatedProperties,
  toggleFeatured,
  getDashboardStats,
  getSearchSuggestions,
};
