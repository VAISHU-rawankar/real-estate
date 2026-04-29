# Real Estate Platform — RULES.md
# Coding Standards, Architecture Decisions, and Engineering Guidelines

## 1. Project Architecture

### 1.1 Backend (Node.js / Express)
- Strict MVC pattern: `routes → middleware → controllers → services → models`
- Controllers are thin: extract arguments, call service, return response
- Services contain ALL business logic — no Mongoose queries in controllers
- Utilities are pure functions with no side effects
- All async handlers wrapped with `asyncHandler()` — no bare try-catch in routes

### 1.2 Frontend (React / Vite)
- RTK Query manages ALL server state — no `useEffect` + `fetch` patterns
- Redux slices for client-only state (search filters, UI, shortlist, auth)
- Lazy-loaded pages via `React.lazy` + `Suspense`
- All pages must have `<Helmet>` title and meta description
- Components in `components/` are reusable; pages in `pages/` compose components

---

## 2. Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Files: React components | PascalCase | `PropertyCard.jsx` |
| Files: JS modules | camelCase | `auth.service.js` |
| Files: Models | PascalCase.model.js | `Property.model.js` |
| Variables / functions | camelCase | `getUserById` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGE_SIZE_MB` |
| CSS classes | kebab-case (Tailwind utilities) | `card-glass` |
| Git branches | feature/description | `feature/property-search` |
| API endpoints | kebab-case | `/api/v1/admin/channel-partners` |

---

## 3. API Design

- All endpoints under `/api/v1/`
- RESTful resource naming: plural nouns (`/properties`, `/leads`)
- Response wrapper: `{ success: boolean, data: any, message: string, meta?: {...} }`
- Error wrapper: `{ success: false, error: { message, code, details? } }`
- HTTP status codes must be semantically correct (201 for create, 204 for delete, etc.)
- Pagination always returns `meta: { page, limit, total, pages, hasNextPage, hasPrevPage }`
- NEVER return raw Mongoose documents — use `.lean()` or `.toJSON()`

---

## 4. Database Rules

- Always add indexes for fields used in queries (see `Property.model.js`)
- Use `.lean()` for read-only queries (30% faster than hydrated documents)
- Avoid N+1 queries — use `.populate()` strategically or aggregate pipelines
- All monetary values stored in **paise** (integer), displayed in rupees
- GeoJSON coordinates: always `[longitude, latitude]` (MongoDB convention)
- Text indexes include weights for relevance ranking

---

## 5. Security (see SECURITY.md for full details)

- Access tokens: 15 min expiry, Bearer header
- Refresh tokens: 7 days, httpOnly Secure SameSite=Strict cookie
- Refresh tokens stored **hashed** (bcrypt) in DB
- Rate limiting applied per endpoint group (not just globally)
- NEVER log sensitive data (passwords, tokens, OTP codes)
- Razorpay webhook signature verified with HMAC SHA-256 + timing-safe compare
- Admin routes: `requireAuth → requireAdmin` middleware chain
- Mongoose `select: false` on `passwordHash`, `refreshToken`, `passwordResetToken`

---

## 6. File Uploads

- All uploads processed through Multer (memoryStorage) → Sharp → S3
- Sharp compresses to WebP, max `IMAGE_MAX_WIDTH` width, `IMAGE_QUALITY`%
- Thumbnails generated at `THUMBNAIL_WIDTH`
- All CDN URLs use CloudFront domain (never raw S3 URLs in responses)
- MIME type validated server-side (not just extension check)
- Max 30 images per property; max 10MB per image

---

## 7. Error Handling

- All application errors thrown as `Error` with `statusCode` and `code` properties:
  ```js
  throw Object.assign(new Error('Message'), { statusCode: 404, code: 'NOT_FOUND' });
  ```
- `error.middleware.js` normalizes: Mongoose validation, CastError, duplicate key, JWT, Multer
- Never expose stack traces in production responses
- Log all 5xx errors with request context (user ID, IP, URL, body)

---

## 8. Frontend State Management

- `authSlice`: user + token in `sessionStorage` (NOT localStorage — security)
- `searchSlice`: all filter state, synced to/from URL via `setFiltersFromURL`
- `shortlistSlice`: property IDs in `localStorage`
- `uiSlice`: toasts, modals, drawer states
- RTK Query cache tags must be invalidated on all mutations

---

## 9. Testing Standards

- Unit tests: `*.test.js` co-located or in `tests/unit/`
- Integration tests: `tests/integration/` — use supertest against real Express app
- Minimum coverage: 80% branches, functions, lines, statements
- Test database: separate URI (set in test env)
- All external services mocked in unit tests (AWS, Razorpay, email)

---

## 10. Git Workflow

- `main`: production-ready only — no direct commits
- `develop`: integration branch
- Feature branches: `feature/`, Bugfixes: `fix/`, Hotfixes: `hotfix/`
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- PR required for all merges to develop/main

---

## 11. Environment Variables

- NEVER commit `.env` — only `.env.example`
- All vars validated at startup by `config/env.js` (Joi schema)
- Frontend vars must be prefixed with `VITE_`
- Secrets must be minimum 32 characters and randomly generated
