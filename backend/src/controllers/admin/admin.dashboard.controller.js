'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const propertyService = require('../../services/property.service');
const leadService = require('../../services/lead.service');
const Lead = require('../../models/Lead.model');
const User = require('../../models/User.model');
const ActivityLog = require('../../models/ActivityLog.model');

/**
 * GET /api/v1/admin/dashboard/stats
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const [propertyStats, leadStats, userCount] = await Promise.all([
      propertyService.getDashboardStats(),
      getLeadStats(),
      User.countDocuments(),
    ]);

    sendSuccess(res, { data: { properties: propertyStats, leads: leadStats, users: { total: userCount } } });
  } catch (err) {
    const fs = require('fs');
    fs.appendFileSync('dashboard_error.log', `[${new Date().toISOString()}] ERROR: ${err.message}\n${err.stack}\n`);
    throw err;
  }
});

async function getLeadStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, byStatus] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: today } }),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const statusMap = byStatus.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});

  return { total, todayCount, byStatus: statusMap };
}

/**
 * GET /api/v1/admin/dashboard/chart/leads
 */
const getLeadChartData = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const data = await Lead.aggregate([
    { $match: { createdAt: { $gte: from } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, { data });
});

/**
 * GET /api/v1/admin/dashboard/recent-activity
 */
const getRecentActivity = asyncHandler(async (req, res) => {
  const activities = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('admin', 'name avatar')
    .lean();

  sendSuccess(res, { data: activities });
});

module.exports = { getDashboardStats, getLeadChartData, getRecentActivity };
