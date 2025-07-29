.PHONY: help install dev up down build test lint format clean

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-15s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install all dependencies
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev: ## Start development environment with Docker
	docker-compose up -d
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/api/v1/docs"

up: ## Start Docker containers
	docker-compose up -d

down: ## Stop Docker containers
	docker-compose down

build: ## Build Docker images
	docker-compose build

test: ## Run all tests
	cd backend && pytest
	cd frontend && npm test

test-backend: ## Run backend tests
	cd backend && pytest -v

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint: ## Run linters
	cd backend && flake8 app/ && mypy app/
	cd frontend && npm run lint

format: ## Format code
	cd backend && black app/ tests/
	cd frontend && npm run format

clean: ## Clean up generated files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	cd frontend && rm -rf .next node_modules

migrate: ## Run database migrations
	cd backend && alembic upgrade head

migrate-create: ## Create a new migration
	cd backend && alembic revision --autogenerate -m "$(m)"

setup-pre-commit: ## Install pre-commit hooks
	cd backend && pre-commit install

db-shell: ## Access PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d transcritor_juridico

redis-cli: ## Access Redis CLI
	docker-compose exec redis redis-cli

logs: ## Show logs
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend