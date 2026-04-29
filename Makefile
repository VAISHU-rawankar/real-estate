.PHONY: dev dev-logs dev-down prod prod-down test test-e2e test-coverage lint lint-fix seed seed-admin build clean logs-backend logs-frontend help

# ─── Colors ────────────────────────────────────────────────────────────────────
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m

# ─── Development ───────────────────────────────────────────────────────────────

dev: ## Start all services in development mode
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose up --build

dev-detach: ## Start all services in background
	docker-compose up --build -d

dev-logs: ## Follow logs from all containers
	docker-compose logs -f

dev-down: ## Stop all development containers
	docker-compose down

# ─── Production ────────────────────────────────────────────────────────────────

prod: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

prod-down: ## Stop production containers
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# ─── Testing ───────────────────────────────────────────────────────────────────

test: ## Run all unit + integration tests
	@echo "$(YELLOW)Running backend tests...$(NC)"
	cd backend && npm test
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	cd frontend && npm test

test-backend: ## Run backend tests only
	cd backend && npm test

test-frontend: ## Run frontend tests only
	cd frontend && npm test

test-e2e: ## Run Cypress E2E tests (requires dev server)
	cd frontend && npm run cypress:run

test-coverage: ## Generate test coverage report
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage

# ─── Linting ───────────────────────────────────────────────────────────────────

lint: ## Run ESLint on backend and frontend
	cd backend && npm run lint
	cd frontend && npm run lint

lint-fix: ## Auto-fix lint errors
	cd backend && npm run lint:fix
	cd frontend && npm run lint:fix

# ─── Database ──────────────────────────────────────────────────────────────────

seed: ## Seed database with sample data
	cd backend && npm run seed

seed-admin: ## Create admin user only
	cd backend && npm run seed:admin

# ─── Build ─────────────────────────────────────────────────────────────────────

build: ## Build frontend and backend for production
	cd backend && npm run build
	cd frontend && npm run build

# ─── Logs ──────────────────────────────────────────────────────────────────────

logs-backend: ## Follow backend container logs
	docker-compose logs -f backend

logs-frontend: ## Follow frontend container logs
	docker-compose logs -f frontend

logs-mongo: ## Follow MongoDB container logs
	docker-compose logs -f mongo

# ─── Cleanup ───────────────────────────────────────────────────────────────────

clean: ## Remove all containers, volumes, node_modules, and builds
	@echo "$(YELLOW)Cleaning up...$(NC)"
	docker-compose down -v
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist
	rm -rf backend/coverage frontend/coverage

# ─── Install ───────────────────────────────────────────────────────────────────

install: ## Install all dependencies
	cd backend && npm install
	cd frontend && npm install

# ─── Help ──────────────────────────────────────────────────────────────────────

help: ## Show available commands
	@echo ""
	@echo "$(GREEN)Real Estate Platform — Available Commands$(NC)"
	@echo "─────────────────────────────────────────────"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
