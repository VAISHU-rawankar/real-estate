'use strict';

const express = require('express');
const router = express.Router();
const cmsCtrl = require('../controllers/admin/cms.controller');

// Public CMS endpoints
router.get('/', cmsCtrl.getCmsContent);
router.get('/:page/:section', cmsCtrl.getSectionContent);

module.exports = router;
