'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const User = require('../../models/User.model');
const Shortlist = require('../../models/Shortlist.model');
const SearchAlert = require('../../models/SearchAlert.model');
const Lead = require('../../models/Lead.model');

const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'avatar', 'preferences'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
  sendSuccess(res, { data: user, message: 'Profile updated' });
});

const getShortlist = asyncHandler(async (req, res) => {
  const items = await Shortlist.find({ user: req.user._id })
    .populate('property', 'title slug price location bhkConfig carpetArea images propertyType status')
    .sort({ createdAt: -1 }).lean();
  sendSuccess(res, { data: items });
});

const addToShortlist = asyncHandler(async (req, res) => {
  try {
    const item = await Shortlist.create({ user: req.user._id, property: req.params.propertyId });
    sendSuccess(res, { status: 201, data: item, message: 'Added to shortlist' });
  } catch (err) {
    if (err.code === 11000) return sendError(res, { status: 409, message: 'Already in shortlist', code: 'DUPLICATE' });
    throw err;
  }
});

const removeFromShortlist = asyncHandler(async (req, res) => {
  await Shortlist.findOneAndDelete({ user: req.user._id, property: req.params.propertyId });
  sendSuccess(res, { message: 'Removed from shortlist' });
});

const getMyEnquiries = asyncHandler(async (req, res) => {
  const orConditions = [];
  if (req.user.email) orConditions.push({ email: req.user.email });
  if (req.user.phone) orConditions.push({ phone: req.user.phone });

  if (orConditions.length === 0) {
    return sendSuccess(res, { data: [] });
  }

  const enquiries = await Lead.find({ $or: orConditions })
    .populate('property', 'title slug images location price')
    .sort({ createdAt: -1 }).lean();

  sendSuccess(res, { data: enquiries });
});

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await SearchAlert.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  sendSuccess(res, { data: alerts });
});

const createAlert = asyncHandler(async (req, res) => {
  const alert = await SearchAlert.create({ user: req.user._id, ...req.body });
  sendSuccess(res, { status: 201, data: alert, message: 'Search alert created' });
});

const deleteAlert = asyncHandler(async (req, res) => {
  await SearchAlert.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  sendSuccess(res, { message: 'Alert deleted' });
});

module.exports = { getProfile, updateProfile, getShortlist, addToShortlist, removeFromShortlist, getMyEnquiries, getAlerts, createAlert, deleteAlert };
