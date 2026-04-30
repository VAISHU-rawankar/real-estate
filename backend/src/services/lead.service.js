'use strict';

const Lead = require('../models/Lead.model');
const Property = require('../models/Property.model');
const User = require('../models/User.model');
const { sendLeadNotification } = require('./email.service');
const buildPagination = require('../utils/pagination');
const logger = require('../utils/logger');

/**
 * Create a new lead from an enquiry.
 * Detects duplicates by phone number within last 24 hours.
 * @param {Object} leadData
 * @returns {Promise<Lead>}
 */
async function createLead(leadData) {
  // Duplicate detection — same phone + same property in last 24h
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicate = await Lead.findOne({
    phone: leadData.phone,
    property: leadData.property,
    createdAt: { $gt: yesterday },
  }).lean();

  const lead = await Lead.create({
    ...leadData,
    isDuplicate: !!duplicate,
  });

  // Increment property enquiry count
  if (leadData.property) {
    await Property.findByIdAndUpdate(leadData.property, { $inc: { enquiryCount: 1 } });
  }

  // Notify admin(s)
  try {
    const admin = await User.findOne({ role: 'admin' }).lean();
    const property = leadData.property ? await Property.findById(leadData.property).select('title').lean() : null;
    if (admin) await sendLeadNotification(admin, lead, property);
  } catch (err) {
    logger.error(`Lead notification failed: ${err.message}`);
  }

  return lead;
}

/**
 * Update lead status with history tracking.
 * @param {string} leadId
 * @param {string} status
 * @param {string} note
 * @param {string} adminId
 * @returns {Promise<Lead>}
 */
async function updateLeadStatus(leadId, status, note, adminId) {
  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw Object.assign(new Error('Lead not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  lead.status = status;
  lead.statusHistory.push({ status, changedBy: adminId, note, changedAt: new Date() });

  if (note) {
    lead.notes.push({ text: note, addedBy: adminId });
  }

  await lead.save();
  return lead;
}

/**
 * Add a note to a lead.
 * @param {string} leadId
 * @param {string} text
 * @param {string} adminId
 * @returns {Promise<Lead>}
 */
async function addLeadNote(leadId, text, adminId) {
  const lead = await Lead.findByIdAndUpdate(
    leadId,
    { $push: { notes: { text, addedBy: adminId, addedAt: new Date() } } },
    { new: true }
  );

  if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
  return lead;
}

/**
 * Get paginated leads with filters.
 * @param {Object} filters
 * @param {Object} query - req.query
 * @returns {Promise<{leads, meta}>}
 */
async function getLeads(filters, query) {
  const { page, limit, skip, buildMeta } = buildPagination(query);
  const mongoQuery = buildLeadQuery(filters);

  const [leads, total] = await Promise.all([
    Lead.find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('property', 'title slug')
      .populate('assignedTo', 'name')
      .lean(),
    Lead.countDocuments(mongoQuery),
  ]);

  return { leads, meta: buildMeta(total) };
}

function buildLeadQuery(filters) {
  const q = {};
  if (filters.status) q.status = filters.status;
  if (filters.source) q.source = filters.source;
  if (filters.property) q.property = filters.property;
  if (filters.dateFrom || filters.dateTo) {
    q.createdAt = {};
    if (filters.dateFrom) q.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) q.createdAt.$lte = new Date(filters.dateTo);
  }
  
  if (filters.search) {
    const regex = new RegExp(filters.search, 'i');
    q.$or = [
      { name: regex },
      { email: regex },
      { phone: regex }
    ];
  }
  
  return q;
}

/**
 * Export leads to CSV format.
 * @param {Object} filters
 * @returns {Promise<string>} CSV string
 */
async function exportLeadsToCSV(filters) {
  const { AsyncParser } = require('json2csv');
  const mongoQuery = buildLeadQuery(filters);

  const leads = await Lead.find(mongoQuery)
    .populate('property', 'title')
    .populate('assignedTo', 'name')
    .lean();

  const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Phone', value: 'phone' },
    { label: 'Email', value: 'email' },
    { label: 'Property', value: 'property.title' },
    { label: 'Source', value: 'source' },
    { label: 'Status', value: 'status' },
    { label: 'Assigned To', value: 'assignedTo.name' },
    { label: 'Date', value: 'createdAt' },
  ];

  const parser = new AsyncParser({ fields });
  const csv = await parser.parse(leads).promise();
  return csv;
}

/**
 * Get lead analytics for charts.
 * @param {string} dateFrom
 * @param {string} dateTo
 * @returns {Promise<Object>}
 */
async function getLeadAnalytics(dateFrom, dateTo) {
  const matchStage = {};
  if (dateFrom || dateTo) {
    matchStage.createdAt = {};
    if (dateFrom) matchStage.createdAt.$gte = new Date(dateFrom);
    if (dateTo) matchStage.createdAt.$lte = new Date(dateTo);
  }

  const [byStatus, bySource, dailyTrend] = await Promise.all([
    Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);

  return { byStatus, bySource, dailyTrend };
}

module.exports = {
  createLead,
  updateLeadStatus,
  addLeadNote,
  getLeads,
  exportLeadsToCSV,
  getLeadAnalytics,
};
