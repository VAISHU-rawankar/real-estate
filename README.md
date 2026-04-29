# Real Estate Platform — README.md

<div align="center">
  <h1>🏠 Real Estate Platform</h1>
  <p><strong>Production-Grade Full-Stack MERN Real Estate Marketplace</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" />
    <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
    <img src="https://img.shields.io/badge/MongoDB-7-green?logo=mongodb" />
    <img src="https://img.shields.io/badge/Redis-7-red?logo=redis" />
    <img src="https://img.shields.io/badge/Docker-ready-blue?logo=docker" />
  </p>
</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone and Configure

```bash
git clone <repo-url> realestate-platform
cd realestate-platform
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start Development Environment

```bash
# Start everything (MongoDB, Redis, Backend, Frontend)
make dev

# Or without Docker:
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

### 3. Seed the Database

```bash
cd backend && npm run seed
```

Admin credentials will be printed in the console.

### 4. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| Health Check | http://localhost:5000/health |
| Admin Panel | http://localhost:3000/admin |

---

## 📁 Project Structure

```
realestate-platform/
├── backend/
│   └── src/
│       ├── config/          # DB, Redis, AWS, Razorpay config
│       ├── controllers/     # Thin route handlers
│       ├── middleware/      # Auth, rate limit, validation, upload, cache
│       ├── models/          # Mongoose schemas (10 models)
│       ├── routes/          # Express router modules
│       ├── services/        # Business logic layer
│       ├── jobs/            # Cron jobs (alerts, digests, cleanup)
│       ├── scripts/         # Seed script
│       └── utils/           # Logger, constants, pagination, tokens
│
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── layouts/         # Public, Auth, Admin layouts
│       ├── pages/           # Route pages (public, auth, user, admin)
│       ├── routes/          # React Router config + guards
│       ├── store/           # Redux store, RTK Query API slices
│       └── styles/          # Global CSS + design tokens
│
├── docker-compose.yml       # Development
├── docker-compose.prod.yml  # Production overrides
├── Makefile                 # One-click commands
├── RULES.md                 # Engineering standards
├── SECURITY.md              # Security policy
└── .env.example             # Environment template
```

---

## 🏗️ Architecture

```
Browser → Nginx → React (Vite SPA)
                ↓ RTK Query
Browser → Nginx → Express API (Node.js)
                        ↓
                    MongoDB (Mongoose)
                    Redis (Cache + Rate Limiting)
                    AWS S3 + CloudFront (Media)
                    Razorpay (Payments)
                    Google Maps API (Geocoding)
                    SendGrid / MSG91 (Email + SMS)
```

---

## 📊 Key Features

| Feature | Status |
|---------|--------|
| Property CRUD (Admin) | ✅ Complete |
| Advanced Search + Filters | ✅ Complete |
| Geospatial Search | ✅ Complete |
| JWT Auth + Refresh Tokens | ✅ Complete |
| OTP (Phone/Email) | ✅ Complete |
| Google OAuth | ✅ Complete |
| Lead CRM | ✅ Complete |
| Razorpay Payments | ✅ Complete |
| AWS S3 Image Upload + Sharp | ✅ Complete |
| Email Templates | ✅ Complete |
| Search Alerts (Cron) | ✅ Complete |
| Redis Caching | ✅ Complete |
| Admin Dashboard + Charts | ✅ Complete |
| Channel Partner System | ✅ Complete |
| CSV Lead Export | ✅ Complete |
| User Shortlist | ✅ Complete |
| Blog CMS | ✅ Complete |
| Property Compare | 🔄 Planned |
| Map View | 🔄 Planned |
| EMI Calculator | 🔄 Planned |

---

## 🔧 Available Commands

```bash
make dev           # Start dev environment
make dev-logs      # Follow all container logs
make dev-down      # Stop dev containers
make prod          # Start production environment
make test          # Run all tests
make test-coverage # Generate coverage report
make lint          # Run ESLint
make seed          # Seed database
make seed-admin    # Create admin user only
make clean         # Remove all containers + volumes
make help          # Show all commands
```

---

## 🛡️ Security

See [SECURITY.md](./SECURITY.md) for full security documentation.

Key measures:
- JWT access tokens (15 min) + httpOnly refresh tokens (7 days)
- bcrypt password hashing (cost 12)
- OWASP rate limiting, NoSQL injection prevention, HPP
- Helmet CSP, HSTS, frameguard
- Razorpay webhook HMAC signature verification
- MIME type validation for uploads
- Activity logging for all admin actions

---

## 📝 Documentation

| Document | Description |
|----------|-------------|
| [RULES.md](./RULES.md) | Engineering standards and conventions |
| [SECURITY.md](./SECURITY.md) | Security policy and implementation |
| `.env.example` | All required environment variables |

---

## 🤝 Contributing

1. Read [RULES.md](./RULES.md) before contributing
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`
4. Run `make lint && make test` before pushing
5. Open a PR against `develop`

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) file.

---

<div align="center">
  <p>Built with ❤️ in India | Anantkamal Software Labs</p>
</div>
