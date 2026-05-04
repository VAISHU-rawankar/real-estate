'use strict';

const express = require('express');
const router = express.Router();
const propertyCtrl = require('../controllers/admin/admin.property.controller');
const dashboardCtrl = require('../controllers/admin/admin.dashboard.controller');
const leadCtrl = require('../controllers/admin/admin.lead.controller');
const cmsCtrl = require('../controllers/admin/cms.controller');
const { uploadMultiple, uploadVideo } = require('../middleware/upload.middleware');
const { logAdminAction } = require('../middleware/admin.middleware');
// Dashboard
router.get('/dashboard/stats', dashboardCtrl.getDashboardStats);
router.get('/dashboard/chart/leads', dashboardCtrl.getLeadChartData);
router.get('/dashboard/recent-activity', dashboardCtrl.getRecentActivity);

// Properties
router.get('/properties', propertyCtrl.getAdminProperties);
router.post('/properties', logAdminAction('Created property', 'property'), propertyCtrl.createProperty);
router.get('/properties/:id', propertyCtrl.getAdminPropertyById);
router.put('/properties/:id', logAdminAction('Updated property', 'property'), propertyCtrl.updateProperty);
router.delete('/properties/:id', logAdminAction('Deleted property', 'property'), propertyCtrl.deleteProperty);
router.patch('/properties/:id/status', logAdminAction('Updated property status', 'property'), propertyCtrl.updatePropertyStatus);
router.patch('/properties/:id/featured', logAdminAction('Toggled featured', 'property'), propertyCtrl.toggleFeatured);
router.post('/properties/:id/images', uploadMultiple, propertyCtrl.uploadPropertyImages);
router.post('/properties/:id/video', uploadVideo, propertyCtrl.uploadPropertyVideo);
router.delete('/properties/:id/images/:imageId', propertyCtrl.deletePropertyImage);
router.patch('/properties/:id/images/reorder', propertyCtrl.reorderImages);

// Leads
router.get('/leads/export', leadCtrl.exportLeads);
router.get('/leads/analytics', leadCtrl.getLeadAnalytics);
router.get('/leads', leadCtrl.getLeads);
router.get('/leads/:id', leadCtrl.getLeadById);
router.patch('/leads/:id/status', logAdminAction('Updated lead status', 'lead'), leadCtrl.updateLeadStatus);
router.patch('/leads/:id/notes', leadCtrl.addLeadNote);

// CMS
router.put('/cms/:page/:section', logAdminAction('Updated CMS content', 'cms'), cmsCtrl.updateSectionContent);

module.exports = router;
