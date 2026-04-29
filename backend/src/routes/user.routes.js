'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user/user.controller');

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.get('/shortlist', ctrl.getShortlist);
router.post('/shortlist/:propertyId', ctrl.addToShortlist);
router.delete('/shortlist/:propertyId', ctrl.removeFromShortlist);
router.get('/enquiries', ctrl.getMyEnquiries);
router.get('/alerts', ctrl.getAlerts);
router.post('/alerts', ctrl.createAlert);
router.delete('/alerts/:id', ctrl.deleteAlert);

module.exports = router;
