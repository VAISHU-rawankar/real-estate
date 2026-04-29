'use strict';

/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express's next() error handler.
 * Eliminates the need for try-catch in every controller.
 *
 * @param {Function} fn - async express route handler
 * @returns {Function} wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
