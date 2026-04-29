'use strict';

const Redis = require('ioredis');
const logger = require('../utils/logger');

let client = null;

/**
 * Returns a connected Redis client (singleton).
 * @returns {Redis}
 */
function getRedisClient() {
  if (client) return client;

  client = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
      if (times > 10) {
        logger.error('Redis: max retries reached. Giving up.');
        return null;
      }
      const delay = Math.min(times * 500, 3000);
      logger.warn(`Redis: retry in ${delay}ms (attempt ${times})`);
      return delay;
    },
    reconnectOnError(err) {
      const targetErrors = ['READONLY', 'ECONNRESET'];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => logger.error(`Redis error: ${err.message}`));
  client.on('close', () => logger.warn('Redis connection closed'));

  return client;
}

/**
 * Gracefully disconnect Redis.
 */
async function disconnectRedis() {
  if (client) {
    await client.quit();
    client = null;
    logger.info('Redis disconnected');
  }
}

module.exports = { getRedisClient, disconnectRedis };
