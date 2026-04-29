'use strict';

const cors = require('cors');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''));

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman in dev)
    if (!origin) {
      if (process.env.NODE_ENV === 'development') return callback(null, true);
      return callback(new Error('No origin — CORS rejected'), false);
    }

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.error(`[CORS REJECTED] Origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24h preflight cache
};

module.exports = cors(corsOptions);
