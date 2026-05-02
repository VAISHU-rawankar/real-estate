'use strict';

const rateLimit = require('express-rate-limit');
const { getRedisClient } = require('../config/redis');

// ─── Redis store for distributed rate limiting ────────────────────────────────
function makeRedisStore(prefix) {
  const redis = getRedisClient();
  return {
    async increment(key) {
      const redisKey = `${prefix}:${key}`;
      const requests = await redis.incr(redisKey);
      if (requests === 1) {
        // Set TTL only on first request
        await redis.expire(redisKey, 900); // 15 min fallback
      }
      return { totalHits: requests, resetTime: new Date(Date.now() + 900_000) };
    },
    async decrement(key) {
      const redisKey = `${prefix}:${key}`;
      await redis.decr(redisKey);
    },
    async resetKey(key) {
      const redisKey = `${prefix}:${key}`;
      await redis.del(redisKey);
    },
  };
}

function makeOptions(windowMs, max, message, prefix) {
  return {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message, code: 'RATE_LIMIT_EXCEEDED' } },
    // Falls back to memory store if Redis fails
    skip: () => false,
  };
}

/**
 * Global: 1000 requests per 15 minutes per IP (relaxed in development)
 */
const globalLimiter = rateLimit({
  ...makeOptions(
    process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000, 
    process.env.NODE_ENV === 'development' ? 5000 : 1000, 
    'Too many requests — please try again later.', 
    'global'
  ),
});

/**
 * Auth endpoints: 20 requests per minute per IP (relaxed in development)
 */
const authLimiter = rateLimit({
  ...makeOptions(
    60 * 1000, 
    process.env.NODE_ENV === 'development' ? 1000 : 20, 
    'Too many auth attempts — please try again in a minute.', 
    'auth'
  ),
});

/**
 * OTP endpoints: 10 requests per 10 minutes per IP (relaxed in development)
 */
const otpLimiter = rateLimit({
  ...makeOptions(
    process.env.NODE_ENV === 'development' ? 60 * 1000 : 10 * 60 * 1000, 
    process.env.NODE_ENV === 'development' ? 100 : 10, 
    'Too many OTP requests — please wait 10 minutes.', 
    'otp'
  ),
});

/**
 * File upload: 10 requests per minute per user
 */
const uploadLimiter = rateLimit({
  ...makeOptions(60 * 1000, 10, 'Too many upload requests.', 'upload'),
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

module.exports = { globalLimiter, authLimiter, otpLimiter, uploadLimiter };
