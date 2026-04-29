'use strict';

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { z } = require('zod');
const { createLead } = require('../controllers/lead/lead.controller');

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
  property: z.string().optional(),
  source: z.enum(['enquiry-form', 'whatsapp', 'call', 'callback-request', 'homepage-form', 'contact-page']).default('enquiry-form'),
  visitRequested: z.boolean().optional(),
  preferredDate: z.string().optional(),
});

router.post('/', optionalAuth, validate(leadSchema), createLead);

module.exports = router;
