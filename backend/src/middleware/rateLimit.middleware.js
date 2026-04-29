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
 * Global: 100 requests per 15 minutes per IP
 */
const globalLimiter = rateLimit({
  ...makeOptions(15 * 60 * 1000, 100, 'Too many requests — please try again later.', 'global'),
});

/**
 * Auth endpoints: 5 requests per minute per IP
 */
const authLimiter = rateLimit({
  ...makeOptions(60 * 1000, 5, 'Too many auth attempts — please try again in a minute.', 'auth'),
});

/**
 * OTP endpoints: 3 requests per 10 minutes per IP
 */
const otpLimiter = rateLimit({
  ...makeOptions(10 * 60 * 1000, 3, 'Too many OTP requests — please wait 10 minutes.', 'otp'),
});

/**
 * File upload: 10 requests per minute per user
 */
const uploadLimiter = rateLimit({
  ...makeOptions(60 * 1000, 10, 'Too many upload requests.', 'upload'),
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

module.exports = { globalLimiter, authLimiter, otpLimiter, uploadLimiter };
