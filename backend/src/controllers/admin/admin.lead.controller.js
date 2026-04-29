'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const leadService = require('../../services/lead.service');

/**
 * GET /api/v1/admin/leads
 */
const getLeads = asyncHandler(async (req, res) => {
  const { status, source, property, dateFrom, dateTo, ...query } = req.query;
  const { leads, meta } = await leadService.getLeads({ status, source, property, dateFrom, dateTo }, query);
  sendSuccess(res, { data: leads, meta });
});

/**
 * GET /api/v1/admin/leads/:id
 */
const getLeadById = asyncHandler(async (req, res) => {
  const Lead = require('../../models/Lead.model');
  const lead = await Lead.findById(req.params.id)
    .populate('property', 'title slug price location images')
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name')
    .populate('statusHistory.changedBy', 'name')
    .lean();

  if (!lead) return sendError(res, { status: 404, message: 'Lead not found', code: 'NOT_FOUND' });
  sendSuccess(res, { data: lead });
});

/**
 * PATCH /api/v1/admin/leads/:id/status
 */
const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const lead = await leadService.updateLeadStatus(req.params.id, status, note, req.user._id);
  sendSuccess(res, { data: lead, message: 'Lead status updated' });
});

/**
 * PATCH /api/v1/admin/leads/:id/notes
 */
const addLeadNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const lead = await leadService.addLeadNote(req.params.id, text, req.user._id);
  sendSuccess(res, { data: lead.notes, message: 'Note added' });
});

/**
 * GET /api/v1/admin/leads/export
 */
const exportLeads = asyncHandler(async (req, res) => {
  const { status, dateFrom, dateTo } = req.query;
  const csv = await leadService.exportLeadsToCSV({ status, dateFrom, dateTo });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
  res.send(csv);
});

/**
 * GET /api/v1/admin/leads/analytics
 */
const getLeadAnalytics = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo } = req.query;
  const analytics = await leadService.getLeadAnalytics(dateFrom, dateTo);
  sendSuccess(res, { data: analytics });
});

module.exports = { getLeads, getLeadById, updateLeadStatus, addLeadNote, exportLeads, getLeadAnalytics };
