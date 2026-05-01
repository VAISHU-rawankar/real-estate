'use strict';

const { verifyAccessToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * requireAuth — Verifies Bearer JWT, attaches req.user.
 * Returns 401 if token is missing, invalid, or expired.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, { status: 401, message: 'Authentication required', code: 'UNAUTHORIZED' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return sendError(res, {
      status: 401,
      message: isExpired ? 'Token expired — please refresh' : 'Invalid token',
      code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
    });
  }

  // Fetch fresh user (catches deactivated accounts)
  const user = await User.findById(decoded.id).select('-passwordHash -refreshToken').lean();

  if (!user || !user.isActive) {
    return sendError(res, { status: 401, message: 'Account not found or deactivated', code: 'UNAUTHORIZED' });
  }

  req.user = user;
  next();
});

/**
 * optionalAuth — Attaches req.user if a valid token is present.
 * Continues without error if no token is provided.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken').lean();
    if (user && user.isActive) req.user = user;
  } catch {
    // Silent failure — optional auth
  }

  next();
});

module.exports = { requireAuth, optionalAuth };
