# 🚀 Production Deployment Guide

This guide provides a step-by-step process for deploying the Real Estate Platform in a production environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your server:
- **Docker** (>= 20.10)
- **Docker Compose** (>= 2.0)
- **Git**

## ☁️ Cloud Deployment

### 1. Backend (Render)
1. Push your code to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and set up the Backend, Database, and (optionally) Frontend.
5. **Note:** Update the `CLIENT_URL` environment variable in the Render dashboard with your actual Frontend URL after it's deployed.

### 2. Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your repository.
4. Select the `frontend` directory as the root.
5. Add an Environment Variable: `VITE_API_URL` = (Your Render Backend URL).
6. Click **Deploy**.

---

## ⚡ Local "One-Click" Deployment (Docker)

If you prefer to deploy manually, follow these steps:

### 1. Clone and Configure
Clone the repository and create your environment file:
```bash
git clone <your-repo-url>
cd realestate-platform
cp .env.example .env
```
Edit the `.env` file and fill in all the required production credentials (database URLs, API keys, etc.).

### 2. Prepare Directories
Create the necessary volumes and log folders:
```bash
mkdir -p nginx/logs nginx/ssl backend/logs
```

### 3. Build and Launch
Start the production stack using Docker Compose:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### 4. Initialize Database
Seed the database with initial data and create the admin account:
```bash
docker exec realestate_backend npm run seed
```

### 5. Verify Deployment
Your website should now be accessible at `http://localhost` (or your server's IP/Domain).

---

## 🔐 Post-Deployment Tasks

### SSL Configuration
1. Place your SSL certificates in `nginx/ssl/`.
2. Edit `nginx/nginx.conf` to enable the HTTPS server block.
3. Update the `CLIENT_URL` in `.env` to use `https`.

### Monitoring
Check the logs of your running containers:
- **Backend Logs:** `docker-compose logs -f backend`
- **Frontend Logs:** `docker-compose logs -f frontend`
- **Nginx Logs:** `docker-compose logs -f nginx`

### Backup
Regularly back up the `mongo-data` volume to prevent data loss.
