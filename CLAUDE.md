# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Legal Transcription System (Transcritor Jurídico) - a full-stack application for transcribing legal audio/video recordings with specialized features for the legal sector.

## Technology Stack

### Backend (Python/FastAPI)
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

## Current Status

The development environment is fully configured and running. Check TODO.md for the complete list of features to implement.

### Priority Tasks
1. JWT Authentication system
2. File upload functionality
3. Whisper AI integration
4. Transcription editor interface
5. Export system (PDF, DOCX, TXT)