'use strict';

const { getRedisClient } = require('../config/redis');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * cacheResponse(ttl) — Redis cache middleware factory.
 * Caches GET response bodies with TTL in seconds.
 * Cache key = SHA256 hash of URL + sorted query string.
 *
 * @param {number} ttl - Cache TTL in seconds
 */
function cacheResponse(ttl) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const redis = getRedisClient();
    const key = buildCacheKey(req);

    try {
      const cached = await redis.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (err) {
      logger.warn(`Cache read error: ${err.message}`);
      return next(); // Fallback — proceed without cache
    }

    // Intercept res.json to store response in cache
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (body && body.success) {
        try {
          await redis.setex(key, ttl, JSON.stringify(body));
          res.setHeader('X-Cache', 'MISS');
        } catch (err) {
          logger.warn(`Cache write error: ${err.message}`);
        }
      }
      return originalJson(body);
    };

    next();
  };
}

/**
 * invalidateCache(pattern) — Clears all Redis keys matching a pattern.
 * Used on property create/update/delete to bust search caches.
 *
 * @param {string} pattern - Redis key pattern (e.g., 'properties:*')
 */
async function invalidateCache(pattern) {
  const redis = getRedisClient();
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Cache invalidated: ${keys.length} keys matching "${pattern}"`);
    }
  } catch (err) {
    logger.warn(`Cache invalidation error: ${err.message}`);
  }
}

function buildCacheKey(req) {
  const queryString = Object.keys(req.query)
    .sort()
    .map((k) => `${k}=${req.query[k]}`)
    .join('&');
  const raw = `${req.path}?${queryString}`;
  return `cache:${crypto.createHash('sha256').update(raw).digest('hex')}`;
}

module.exports = { cacheResponse, invalidateCache };
