# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Legal Transcription System (Transcritor Jurídico) - a full-stack application for transcribing legal audio/video recordings with specialized features for the legal sector.

## Technology Stack

### Backend (Python/FastAPI)
- Runtime: Python 3.12
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy (async)
- **Transcription**: OpenAI Whisper
- **Cache/Queue**: Redis
- **Authentication**: JWT with python-jose

### Frontend (Next.js/React)
- **Framework**: Next.js 14 with TypeScript
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI**: Tailwind CSS + Radix UI
- **File Upload**: react-dropzone

## Common Development Commands

```bash
# Start development environment
make dev

# Run tests
make test

# Format code
make format

# Run linters
make lint

# Database migrations
make migrate-create m="migration name"
make migrate

# Access services
make db-shell    # PostgreSQL shell
make redis-cli   # Redis CLI
make logs        # View all logs
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core configs (database, settings)
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js app directory
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
│   └── tests/
└── docker-compose.yml
```

## Key Models

### User
- Authentication and authorization
- Profile management
- Transcription ownership

### Transcription
- File upload and storage
- Processing status tracking
- Legal metadata (case number, court, date)
- Full text and segments

### TranscriptionSegment
- Time-based segments
- Speaker identification
- Confidence scores

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

- `/auth/*` - Authentication endpoints
- `/users/*` - User management
- `/transcriptions/*` - Transcription CRUD and processing
- `/docs` - Swagger documentation

## Development Workflow

1. **Backend Changes**:
   - Models in `app/models/`
   - Create/update schemas in `app/schemas/`
   - Implement logic in `app/services/`
   - Add endpoints in `app/api/`
   - Write tests in `tests/`

2. **Frontend Changes**:
   - Pages in `src/app/`
   - Components in `src/components/`
   - API calls in `src/lib/api/`
   - Types in `src/types/`

3. **Database Changes**:
   - Modify models
   - Create migration: `make migrate-create m="description"`
   - Apply migration: `make migrate`

## Important Considerations

- **Security**: All transcriptions require authentication
- **File Handling**: Max upload size is 100MB
- **Supported Formats**: .mp3, .wav, .m4a, .ogg, .flac, .mp4, .avi, .mov
- **Whisper Models**: tiny, base, small, medium, large (configured in .env)

## Agents & Orchestration
- Project-level subagents live in `.claude/agents/` with least-privilege `tools:` configured
- Use proactively after code edits/merges; prefer parallel delegation (review + security + docs)
- Standard output envelope (AURORA): TL;DR, Resumo, Plano, Edits, Testes, Comandos, Notas (métricas/alertas/SLO, custo)

## Architecture & Implementation Details

### API Proxy System
The frontend uses Next.js API Routes (`/app/api/[...path]/route.ts`) to proxy requests to the backend:
- **Intelligent Trailing Slash Handling**: Automatically determines if endpoints need trailing slashes based on FastAPI patterns
- **Auth Endpoints**: `/auth/login`, `/auth/register`, `/auth/me` - NO trailing slash
- **Collection Endpoints**: `/transcriptions/` - WITH trailing slash
- **Resource Endpoints**: `/transcriptions/123` - NO trailing slash
- **Content-Type Handling**: Properly handles JSON, form-urlencoded, and multipart/form-data requests

### Production Deployment
- **Frontend**: Deployed on Vercel with Next.js 14
- **Backend**: FastAPI with HTTPS endpoint
- **API Communication**: Frontend proxy routes handle CORS and trailing slash issues
- **Environment Variables**: 
  - `BACKEND_URL` (server-side) or `NEXT_PUBLIC_API_URL` (build-time)
  - Backend uses JSON `BACKEND_CORS_ORIGINS` and optional `BACKEND_CORS_ORIGIN_REGEX`

### Authentication System
- **JWT Implementation**: Complete with access/refresh tokens
- **Token Storage**: Secure storage in browser with automatic refresh
- **Protected Routes**: All transcription operations require authentication
- **CORS Configuration**: Properly configured for production domains

## Current Status

**IMPLEMENTED ✅**:
- JWT Authentication system (complete)
- File upload functionality (working)
- Transcription listing and management
- Text processing (normalize, compare, export DOCX)
- Production deployment (Vercel + HTTPS backend)
- API proxy with intelligent routing

**IN DEVELOPMENT 🔄**:
- Whisper AI integration
- Real-time processing notifications
- Advanced transcription editor

### Next Priority Tasks
1. Whisper AI integration for audio processing
2. WebSocket/SSE for real-time progress updates
3. Advanced transcription editor with audio sync
4. Export system enhancements (PDF, formatted templates)