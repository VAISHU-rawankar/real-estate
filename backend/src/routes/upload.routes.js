'use strict';

const express = require('express');
const router = express.Router();
const { uploadMultiple, uploadSingle, uploadVideo } = require('../middleware/upload.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const s3Service = require('../services/s3.service');

router.post('/images', uploadMultiple, asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: { message: 'No files uploaded' } });
  }
  const folder = req.body.folder || `uploads/${req.user._id}`;
  const results = await s3Service.uploadImages(req.files.map(f => f.buffer), folder);
  sendSuccess(res, { data: results, message: `${results.length} image(s) uploaded` });
}));

router.post('/video', uploadVideo, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: { message: 'No video file uploaded' } });
  }
  const folder = req.body.folder || `uploads/${req.user._id}/videos`;
  const result = await s3Service.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
  sendSuccess(res, { data: result, message: 'Video uploaded successfully' });
}));

module.exports = router;
