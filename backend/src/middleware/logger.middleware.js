'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// ─── Morgan stream → Winston ──────────────────────────────────────────────────
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

/**
 * HTTP request logger for production.
 * Logs: method, URL, status, response time, content-length.
 */
const loggerMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream: morganStream }
);

module.exports = { loggerMiddleware, morganStream };
