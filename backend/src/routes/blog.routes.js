'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const BlogPost = require('../models/BlogPost.model');
const buildPagination = require('../utils/pagination');

// Public: list published posts
router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip, buildMeta } = buildPagination(req.query);
  const [posts, total] = await Promise.all([
    BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 }).skip(skip).limit(limit).populate('author', 'name').lean(),
    BlogPost.countDocuments({ status: 'published' }),
  ]);
  sendSuccess(res, { data: posts, meta: buildMeta(total) });
}));

// Public: single post by slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('author', 'name avatar').lean();
  if (!post) return res.status(404).json({ success: false, error: { message: 'Post not found', code: 'NOT_FOUND' } });
  sendSuccess(res, { data: post });
}));

module.exports = router;
