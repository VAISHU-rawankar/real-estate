'use strict';

const cron = require('node-cron');
const logger = require('../utils/logger');
const SearchAlert = require('../models/SearchAlert.model');
const User = require('../models/User.model');
const Property = require('../models/Property.model');
const OTP = require('../models/OTP.model');
const { sendSearchAlertEmail } = require('../services/email.service');
const { sendLeadNotification } = require('../services/email.service');
const Lead = require('../models/Lead.model');

/**
 * Start all background cron jobs.
 */
function startJobs() {
  // Search alert emails — run every hour
  cron.schedule('0 * * * *', runSearchAlerts);

  // Daily lead digest — run at 8am every day
  cron.schedule('0 8 * * *', sendDailyLeadDigest);

  // Expire OTPs cleanup — run every 30 minutes (TTL index handles most, this is safety net)
  cron.schedule('*/30 * * * *', cleanupExpiredOTPs);

  logger.info('⏰ Background jobs started');
}

/**
 * Check active search alerts and notify users of new matching properties.
 */
async function runSearchAlerts() {
  logger.info('Running search alert job...');
  try {
    const alerts = await SearchAlert.find({ isActive: true }).populate('user').lean();

    for (const alert of alerts) {
      if (!alert.user) continue;

      const lastTriggered = alert.lastTriggeredAt || new Date(0);
      const query = buildAlertQuery(alert.filters, lastTriggered);

      const newProperties = await Property.find(query).limit(10).lean({ virtuals: true });
      if (newProperties.length === 0) continue;

      await sendSearchAlertEmail(alert.user, newProperties, alert);
      await SearchAlert.findByIdAndUpdate(alert._id, {
        lastTriggeredAt: new Date(),
        $inc: { matchCount: newProperties.length },
      });
    }
  } catch (err) {
    logger.error(`Search alert job failed: ${err.message}`);
  }
}

function buildAlertQuery(filters, since) {
  const q = { status: { $in: ['active', 'featured'] }, createdAt: { $gt: since } };
  if (filters.city) q['location.city'] = new RegExp(filters.city, 'i');
  if (filters.propertyType) q.propertyType = filters.propertyType;
  if (filters.listingType) q.listingType = filters.listingType;
  if (filters.bhkConfig?.length) q.bhkConfig = { $in: filters.bhkConfig };
  if (filters.priceMin || filters.priceMax) {
    q.price = {};
    if (filters.priceMin) q.price.$gte = filters.priceMin;
    if (filters.priceMax) q.price.$lte = filters.priceMax;
  }
  return q;
}

/**
 * Send daily lead digest to admin.
 */
async function sendDailyLeadDigest() {
  logger.info('Running daily lead digest job...');
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newLeads = await Lead.countDocuments({ createdAt: { $gt: yesterday } });
    if (newLeads === 0) return;

    const admin = await User.findOne({ role: 'admin' }).lean();
    if (!admin) return;

    const { sendEmail } = require('../services/email.service');
    await sendEmail({
      to: admin.email,
      subject: `Daily Lead Digest: ${newLeads} new lead(s) received`,
      html: `<p>You received <strong>${newLeads}</strong> new enquiries in the last 24 hours.</p><a href="${process.env.CLIENT_URL}/admin/leads">View Leads</a>`,
    });
  } catch (err) {
    logger.error(`Lead digest job failed: ${err.message}`);
  }
}

/**
 * Cleanup expired and used OTPs (safety net beyond TTL index).
 */
async function cleanupExpiredOTPs() {
  try {
    const result = await OTP.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isUsed: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    });
    if (result.deletedCount > 0) {
      logger.debug(`OTP cleanup: deleted ${result.deletedCount} expired records`);
    }
  } catch (err) {
    logger.error(`OTP cleanup job failed: ${err.message}`);
  }
}

module.exports = { startJobs };
