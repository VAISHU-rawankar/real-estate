'use strict';

const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Import route modules
const authRoutes = require('./auth.routes');
const propertyRoutes = require('./property.routes');
const adminRoutes = require('./admin.routes');
const userRoutes = require('./user.routes');
const leadRoutes = require('./lead.routes');
const paymentRoutes = require('./payment.routes');
const blogRoutes = require('./blog.routes');
const partnerRoutes = require('./partner.routes');
const uploadRoutes = require('./upload.routes');
const cmsRoutes = require('./cms.routes');
const chatRoutes = require('./chat.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/cms', cmsRoutes);
router.use('/admin', requireAuth, requireAdmin, adminRoutes);
router.use('/user', requireAuth, userRoutes);
router.use('/leads', leadRoutes);
router.use('/payments', paymentRoutes);
router.use('/blog', blogRoutes);
router.use('/partners', partnerRoutes);
router.use('/upload', requireAuth, uploadRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
