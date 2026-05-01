'use strict';

const { sendError } = require('../utils/apiResponse');
const ActivityLog = require('../models/ActivityLog.model');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

/**
 * requireAdmin — must run AFTER requireAuth.
 * Checks req.user.role === 'admin'. Logs access attempt.
 */
const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return sendError(res, { status: 401, message: 'Authentication required', code: 'UNAUTHORIZED' });
  }

  if (req.user.role !== 'admin') {
    logger.warn(`Unauthorized admin access attempt by user ${req.user._id} (${req.user.email}) — IP: ${req.ip}`);
    return sendError(res, { status: 403, message: 'Access denied — admin only', code: 'FORBIDDEN' });
  }

  next();
});

/**
 * requireChannelPartner — must run AFTER requireAuth.
 * Allows admins and channelPartners.
 */
const requireChannelPartner = asyncHandler((req, res, next) => {
  if (!req.user) {
    return sendError(res, { status: 401, message: 'Authentication required', code: 'UNAUTHORIZED' });
  }

  if (!['admin', 'channelPartner'].includes(req.user.role)) {
    return sendError(res, { status: 403, message: 'Access denied — partners only', code: 'FORBIDDEN' });
  }

  next();
});

/**
 * logAdminAction — middleware factory to log an admin action to ActivityLog.
 * @param {string} action - Description of the action
 * @param {string} target - Target model name
 */
const logAdminAction = (action, target) => async (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  res.json = async (body) => {
    // Only log on success responses
    if (body && body.success && req.user) {
      const targetId = req.params.id || body.data?._id;
      try {
        await ActivityLog.create({
          admin: req.user._id,
          action,
          target,
          targetId: targetId || null,
          targetTitle: body.data?.title || body.data?.name || null,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { method: req.method, url: req.originalUrl },
        });
      } catch (err) {
        logger.error(`ActivityLog write failed: ${err.message}`);
      }
    }
    return originalJson(body);
  };

  next();
};

module.exports = { requireAdmin, requireChannelPartner, logAdminAction };
