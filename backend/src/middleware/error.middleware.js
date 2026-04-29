'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Global error handler — last middleware in Express pipeline.
 * Normalizes all errors to a consistent JSON response.
 * Never exposes stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';
  let details = null;

  // ─── Mongoose Validation Error ────────────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    status = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.keys(err.errors).reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
  }

  // ─── Mongoose Cast Error (invalid ObjectId) ───────────────────────────────
  if (err instanceof mongoose.Error.CastError) {
    status = 400;
    code = 'INVALID_ID';
    message = `Invalid value for field: ${err.path}`;
  }

  // ─── Mongoose Duplicate Key Error ─────────────────────────────────────────
  if (err.code === 11000) {
    status = 409;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  // ─── JWT Errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // ─── Multer Errors ────────────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    code = 'FILE_TOO_LARGE';
    message = 'File size exceeds the 10 MB limit';
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    status = 400;
    code = 'TOO_MANY_FILES';
    message = 'Too many files uploaded at once';
  }

  // ─── Log server errors ────────────────────────────────────────────────────
  if (status >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} — ${status}: ${message}`, {
      stack: err.stack,
      body: req.body,
      user: req.user?._id,
      ip: req.ip,
    });
  }

  // ─── Response ─────────────────────────────────────────────────────────────
  const payload = {
    success: false,
    error: { message, code },
  };

  if (details) payload.error.details = details;

  // Never expose stack in production
  if (process.env.NODE_ENV === 'development' && status >= 500) {
    payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
};

module.exports = errorMiddleware;
