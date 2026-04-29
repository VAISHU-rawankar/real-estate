'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;

/**
 * Establish MongoDB connection with exponential back-off retry logic.
 * @returns {Promise<void>}
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
    retryCount = 0;
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting reconnect...');
    scheduleRetry();
  });

  await attemptConnection(uri);
}

async function attemptConnection(uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Increase to 10s
      socketTimeoutMS: 60000,         // Increase to 60s
      heartbeatFrequencyMS: 10000,    // Keep the connection alive
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
  } catch (err) {
    logger.error(`MongoDB initial connection failed: ${err.message}`);
    scheduleRetry();
  }
}

function scheduleRetry() {
  if (retryCount >= MAX_RETRIES) {
    logger.error(`MongoDB: max retries (${MAX_RETRIES}) reached. Exiting.`);
    process.exit(1);
  }
  retryCount += 1;
  logger.info(`MongoDB: retry ${retryCount}/${MAX_RETRIES} in ${RETRY_INTERVAL_MS / 1000}s...`);
  setTimeout(() => attemptConnection(process.env.MONGO_URI), RETRY_INTERVAL_MS);
}

/**
 * Gracefully close the MongoDB connection.
 */
async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
