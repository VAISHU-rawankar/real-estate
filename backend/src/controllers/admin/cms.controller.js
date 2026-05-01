'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const Cms = require('../../models/Cms.model');

/**
 * GET /api/v1/cms
 * Get all CMS content, optionally filtered by page
 */
const getCmsContent = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const query = page ? { page } : {};
  
  const content = await Cms.find(query).lean();
  
  // Transform to a dictionary-like format for easier frontend consumption
  // { home: { hero: { title: '...' }, about: { ... } } }
  const formattedContent = content.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = {};
    acc[item.page][item.section] = item;
    return acc;
  }, {});

  sendSuccess(res, { data: formattedContent });
});

/**
 * GET /api/v1/cms/:page/:section
 * Get specific section content
 */
const getSectionContent = asyncHandler(async (req, res) => {
  const { page, section } = req.params;
  const content = await Cms.findOne({ page, section }).lean();
  
  if (!content) {
    return sendSuccess(res, { data: null, message: 'Content not found' });
  }
  
  sendSuccess(res, { data: content });
});

/**
 * PUT /api/v1/admin/cms/:page/:section
 * Create or update section content
 */
const updateSectionContent = asyncHandler(async (req, res) => {
  const { page, section } = req.params;
  const updateData = req.body;
  
  const content = await Cms.findOneAndUpdate(
    { page, section },
    { 
      $set: { 
        content: updateData,
        updatedBy: req.user._id
      } 
    },
    { new: true, upsert: true, runValidators: true }
  );

  sendSuccess(res, { data: content, message: 'Content updated successfully' });
});

module.exports = {
  getCmsContent,
  getSectionContent,
  updateSectionContent
};
