# Real Estate Platform — One-Click Deployment Script (Windows PowerShell)

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   Real Estate Platform — Production Deployment     " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

# 1. Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Write-Host "Copying .env.example to .env..."
        Copy-Item ".env.example" ".env"
        Write-Host "Please edit .env with your production credentials and run this script again." -ForegroundColor Red
        exit
    } else {
        Write-Host "Error: .env and .env.example missing." -ForegroundColor Red
        exit
    }
}

# 2. Check for Docker
if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: docker is not installed." -ForegroundColor Red
    exit
}

# 3. Create necessary directories
Write-Host "Creating logs and data directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "nginx/logs" | Out-Null
New-Item -ItemType Directory -Force -Path "backend/logs" | Out-Null

# 4. Build and Start
Write-Host "Building and starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# 5. Seed Database (Optional)
$seed = Read-Host "Do you want to seed the database with initial data? (y/n)"
if ($seed -eq "y" -or $seed -eq "Y") {
    Write-Host "Seeding database..."
    docker exec realestate_backend npm run seed
}

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   Deployment Successful!                           " -ForegroundColor Green
Write-Host "   Website is now running on http://localhost       " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
