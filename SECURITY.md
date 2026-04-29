# Real Estate Platform — SECURITY.md
# Security Policy and Implementation Guidelines

## Overview
This platform adheres to OWASP Top 10 mitigation practices. All contributions must follow this document.

---

## 1. Authentication & Authorization

| Control | Implementation |
|---------|----------------|
| Password hashing | bcryptjs, cost factor 12 |
| Access tokens | JWT, 15 min expiry, RS256-compatible secret (min 32 chars) |
| Refresh tokens | JWT, 7 days, stored **hashed** in DB, httpOnly Secure cookie |
| Token rotation | New refresh token issued on every use |
| Google OAuth | Passport.js, PKCE flow, state parameter |
| OTP | 6-digit, 5-min expiry, bcrypt-hashed in DB, max 3 attempts, 15-min lockout |
| Admin 2FA | OTP to registered email before sensitive admin actions |
| RBAC | `role: user | admin | channelPartner` — middleware chain enforced |

---

## 2. API Security

| Attack | Mitigation |
|--------|-----------|
| Brute force | express-rate-limit: 5 req/min for auth, 3 req/10min for OTP |
| NoSQL injection | express-mongo-sanitize (strips `$` and `.` from inputs) |
| XSS | Helmet CSP, React's JSX auto-escaping |
| CSRF | SameSite=Strict cookies + custom header check |
| HTTP Parameter Pollution | hpp middleware |
| Clickjacking | Helmet `frameguard: deny` |
| MIME sniffing | Helmet `noSniff` |
| Information disclosure | Stack traces hidden in production, generic error messages |
| Timing attacks | `crypto.timingSafeEqual` for token/signature comparisons |
| Mass assignment | Explicit whitelist in update operations |

---

## 3. Content Security Policy

```
default-src 'self';
script-src 'self' https://checkout.razorpay.com https://maps.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https: [CDN_DOMAIN];
connect-src 'self' [CLIENT_URL];
frame-src 'none';
object-src 'none';
```

---

## 4. Data Protection

- Phone numbers and email addresses are treated as PII
- Admin exports (CSV) require admin role and are logged to ActivityLog
- Refresh token stored as bcrypt hash — raw token never persisted
- S3 objects use private ACL — all access via CloudFront signed URLs
- DB connections use SSL in production (`MONGO_URI` must include `ssl=true`)
- Redis password required in production

---

## 5. Payment Security (Razorpay)

1. Order created server-side only — amount never trusted from client
2. Payment verification uses HMAC SHA-256 signature: `orderId|paymentId`
3. Webhook signature verified using `crypto.timingSafeEqual`
4. Idempotency key prevents duplicate payment processing
5. Raw body preserved for webhook signature verification

---

## 6. File Upload Security

- MIME type validated server-side (magic bytes via multer fileFilter)
- File size limit: 10 MB per file, 30 files per property
- Files processed by Sharp before storage (strips EXIF metadata)
- Files stored only in S3 (never local filesystem)
- Filenames are UUID-generated (no user-controlled paths)

---

## 7. Incident Response

| Severity | Response Time | Action |
|----------|--------------|--------|
| Critical (token leak, data breach) | 1 hour | Rotate all secrets, invalidate all sessions |
| High (auth bypass, IDOR) | 4 hours | Patch + hotfix deploy |
| Medium (rate limiting bypass) | 24 hours | Next sprint fix |
| Low (info disclosure) | 1 week | Planned fix |

---

## 8. Security Reporting

Report vulnerabilities to: **security@yourrealestate.com**

Please include:
- Vulnerability description
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We commit to responding within 48 hours and fixing Critical/High within 7 days.

---

## 9. Production Checklist

Before every production deployment:

- [ ] All `.env` secrets rotated
- [ ] `NODE_ENV=production` set
- [ ] HTTPS/TLS configured (Let's Encrypt or AWS ACM)
- [ ] MongoDB SSL enabled
- [ ] Redis password set
- [ ] Rate limiting tested
- [ ] CSP headers validated
- [ ] Sentry error tracking active
- [ ] No debug/development dependencies in production bundle
- [ ] Admin accounts use strong unique passwords
