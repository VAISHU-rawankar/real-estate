'use strict';

require('dotenv').config();
// Validate all env vars before anything else
require('./config/env');

const http = require('http');
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const { getRedisClient, disconnectRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { startJobs } = require('./jobs');

const PORT = process.env.PORT || 5000;

// ─── Handle uncaught exceptions ───────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

// ─── Handle unhandled rejections ──────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    // Connect to databases
    await connectDB();
    getRedisClient(); // initialize singleton

    // Create HTTP server
    const server = http.createServer(app);

    // Start background jobs
    startJobs();

    // Listen
    server.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`🔗 Health: http://localhost:${PORT}/health`);
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────────────────
    async function gracefulShutdown(signal) {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        try {
          await disconnectDB();
          await disconnectRedis();
          logger.info('Graceful shutdown complete');
          process.exit(0);
        } catch (err) {
          logger.error(`Error during shutdown: ${err.message}`);
          process.exit(1);
        }
      });

      // Force exit after 30s
      setTimeout(() => {
        logger.error('Forced shutdown after 30s timeout');
        process.exit(1);
      }, 30_000);
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (err) {
    logger.error(`Bootstrap failed: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
}

bootstrap();
