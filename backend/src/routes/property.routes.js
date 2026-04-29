'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/property/property.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const { cacheResponse } = require('../middleware/cache.middleware');
const { CACHE_TTL } = require('../utils/constants');

// Public routes with optional auth (for shortlist state)
router.get('/', cacheResponse(CACHE_TTL.PROPERTY_SEARCH), optionalAuth, controller.getProperties);
router.get('/featured', cacheResponse(CACHE_TTL.FEATURED_PROPERTIES), controller.getFeaturedProperties);
router.get('/suggestions', controller.getSearchSuggestions);
router.get('/:slug', cacheResponse(CACHE_TTL.PROPERTY_DETAIL), optionalAuth, controller.getPropertyBySlug);
router.get('/:slug/related', controller.getRelatedProperties);

module.exports = router;
