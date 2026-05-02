'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const logger = require('./utils/logger');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const corsMiddleware = require('./middleware/cors.middleware');
const { loggerMiddleware } = require('./middleware/logger.middleware');
const router = require('./routes');

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://checkout.razorpay.com', 'https://maps.googleapis.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', process.env.CLOUDFRONT_DOMAIN],
        connectSrc: ["'self'", process.env.CLIENT_URL],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(corsMiddleware);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Sanitization & Security ──────────────────────────────────────────────────
app.use(mongoSanitize()); // NoSQL injection prevention
app.use(hpp());           // HTTP Parameter Pollution prevention

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression({ threshold: 1024 }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(loggerMiddleware);
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// ─── Global Rate Limiting ─────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
