'use strict';

/**
 * Standard API response wrapper.
 * All controller responses should go through these helpers.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {*}      options.data     - Response payload
 * @param {string} options.message  - Human-readable message
 * @param {number} options.status   - HTTP status code (default 200)
 * @param {Object} options.meta     - Pagination / additional metadata
 */
function sendSuccess(res, { data = null, message = 'Success', status = 200, meta = null } = {}) {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {string} options.message   - Error message
 * @param {number} options.status    - HTTP status code (default 500)
 * @param {string} options.code      - Machine-readable error code
 * @param {*}      options.details   - Field-level validation errors
 */
function sendError(res, { message = 'Internal Server Error', status = 500, code = 'SERVER_ERROR', details = null } = {}) {
  const payload = { success: false, error: { message, code } };
  if (details) payload.error.details = details;
  return res.status(status).json(payload);
}

module.exports = { sendSuccess, sendError };
