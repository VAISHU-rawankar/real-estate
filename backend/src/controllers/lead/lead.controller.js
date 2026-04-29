'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const leadService = require('../../services/lead.service');

/**
 * POST /api/v1/leads — Public lead/enquiry submission
 */
const createLead = asyncHandler(async (req, res) => {
  const leadData = req.validatedBody;
  // Attach user if authenticated
  if (req.user) leadData.userId = req.user._id;

  const lead = await leadService.createLead(leadData);
  sendSuccess(res, { status: 201, data: { id: lead._id }, message: 'Enquiry submitted successfully. We will contact you soon.' });
});

module.exports = { createLead };
