#!/bin/bash

# Real Estate Platform — One-Click Deployment Script
# This script prepares and starts the production environment using Docker Compose.

set -e

# --- Configuration ---
ENV_FILE=".env"
DOCKER_COMPOSE_BASE="docker-compose.yml"
DOCKER_COMPOSE_PROD="docker-compose.prod.yml"

# --- Colors ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}   Real Estate Platform — Production Deployment     ${NC}"
echo -e "${GREEN}====================================================${NC}"

# 1. Check for .env file
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Warning: .env file not found.${NC}"
    if [ -f ".env.example" ]; then
        echo -e "Copying .env.example to .env..."
        cp .env.example .env
        echo -e "${RED}Please edit .env with your production credentials and run this script again.${NC}"
        exit 1
    else
        echo -e "${RED}Error: .env and .env.example missing.${NC}"
        exit 1
    fi
fi

# 2. Check for Docker
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: docker is not installed.${NC}" >&2
  exit 1
fi

# 3. Check for Docker Compose
if ! [ -x "$(command -v docker-compose)" ]; then
  echo -e "${RED}Error: docker-compose is not installed.${NC}" >&2
  exit 1
fi

# 4. Create necessary directories
echo -e "${YELLOW}Creating logs and data directories...${NC}"
mkdir -p nginx/logs
mkdir -p backend/logs

# 5. Build and Start
echo -e "${YELLOW}Building and starting services...${NC}"
docker-compose -f $DOCKER_COMPOSE_BASE -f $DOCKER_COMPOSE_PROD up --build -d

# 6. Seed Database (Optional)
echo -e "${YELLOW}Do you want to seed the database with initial data? (y/n)${NC}"
read -r seed_db
if [[ $seed_db =~ ^[Yy]$ ]]; then
    echo -e "Seeding database..."
    docker exec realestate_backend npm run seed
fi

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}   Deployment Successful!                           ${NC}"
echo -e "${GREEN}   Website is now running on http://localhost       ${NC}"
echo -e "${GREEN}====================================================${NC}"
