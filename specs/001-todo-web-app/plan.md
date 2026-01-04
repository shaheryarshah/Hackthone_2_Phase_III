# Implementation Plan: Todo Full-Stack Application (Phase II)

**Branch**: `001-todo-web-app` | **Date**: 2025-12-31 | **Spec**: [spec.md](spec.md)
**Phase**: II - Multi-User Authentication & Persistence
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Summary

Build a production-grade, multi-user todo management application with JWT-based authentication. This Phase II extends the existing todo CRUD foundation with user registration, login/logout, and per-user data isolation. The system uses a monorepo architecture with Next.js 16+ frontend and FastAPI backend, backed by Neon Serverless PostgreSQL with SQLModel ORM. Authentication follows a Better Auth → JWT → FastAPI verification flow with user isolation enforced at both database and API layers.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI 0.109+, SQLModel 0.0+, Pydantic 2.x, Uvicorn (backend) | Next.js 16+, React 18, Better Auth (frontend)
**Storage**: Neon Serverless PostgreSQL (shared instance with table prefix isolation)
**Testing**: pytest, pytest-asyncio, pytest-cov (backend) | Jest, React Testing Library (frontend)
**Target Platform**: Linux server (backend), Web browser (frontend)
**Project Type**: web (monorepo with separate backend/frontend)
**Performance Goals**: Sub-second response times for all API endpoints; JWT verification under 50ms
**Constraints**: JWT shared secret for verification; user isolation on all queries; no client-side secrets
**Scale/Scope**: Individual users with personal todo lists; ~100-1000 todos per user expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| Spec-Driven Development | All code based on approved spec | PASS |
| Strict Separation of Concerns | Backend/frontend separated; business logic in API layer | PASS |
| API-First Architecture | REST API is authoritative contract | PASS |
| Input Validation on Backend | All input validated via Pydantic/SQLModel | PASS |
| Proper Error Handling | HTTP status codes with error messages | PASS |
| Clean Architecture | Models/Services/API layers separate | PASS |
| JWT Security | Passwords hashed; tokens verified on every request | PASS |
| User Isolation | All queries filtered by authenticated user ID | PASS |

No violations detected.

## Phase 0: Research & Decisions

### Technology Choices (from User Input)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Frontend Framework | Next.js 16+ (App Router) | Modern React framework with SSR, API routes, and excellent DX |
| Backend Framework | FastAPI | High-performance Python ASGI framework with automatic OpenAPI docs |
| ORM | SQLModel | Unified SQLAlchemy + Pydantic for type-safe database operations |
| Database | Neon Serverless PostgreSQL | Serverless PostgreSQL with excellent scaling characteristics |
| Authentication | Better Auth (frontend) + JWT (shared secret) | Better Auth provides React integration; JWT enables stateless auth |
| Password Hashing | bcrypt or Argon2 | Industry-standard; bcrypt selected for simplicity and widespread support |

### JWT Authentication Flow

1. **Registration**: User submits email/password → Backend validates → Creates user with bcrypt hash → Returns JWT
2. **Login**: User submits email/password → Backend verifies credentials → Returns JWT
3. **API Requests**: Client sends JWT in `Authorization: Bearer <token>` header
4. **Token Verification**: FastAPI middleware validates JWT signature with shared secret → Extracts user_id
5. **Query Filtering**: All todo queries include `WHERE user_id = :current_user_id`

### Database Schema Approach

- **Users table**: `users_001_todo` (prefixed for Neon shared instance isolation)
- **Todos table**: `todos_001_todo` (includes `user_id` foreign key)
- **Indexes**: Primary key on `id`, foreign key on `user_id`, composite index on `(user_id, id)` for owned queries

### Unknowns Resolved

All technology choices were specified in the user input. No additional research needed.

---

## Phase 1: Design Artifacts

### Project Structure

#### Documentation (this feature)

```text
specs/001-todo-web-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (this file - consolidated decisions)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API contracts)
│   ├── overview.md
│   └── openapi.yaml
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

#### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.py              # User SQLModel entity
│   │   └── todo.py              # Todo SQLModel entity (updated with user_id)
│   ├── schemas/
│   │   ├── user.py              # User Pydantic schemas (registration, login, response)
│   │   └── todo.py              # Todo Pydantic schemas (updated with user context)
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py          # Registration, login, token refresh endpoints
│   │   │   └── todos.py         # CRUD endpoints (updated with auth dependency)
│   │   └── __init__.py
│   ├── services/
│   │   ├── auth_service.py      # Password hashing, JWT generation
│   │   ├── todo_service.py      # Business logic with user isolation
│   │   └── __init__.py
│   ├── middleware/
│   │   └── auth.py              # JWT verification dependency
│   ├── database.py              # Database connection
│   ├── dependencies.py          # FastAPI dependencies (get_current_user)
│   └── main.py                  # FastAPI app with CORS and middleware
├── alembic/                     # Database migrations
├── requirements.txt
└── .env

frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication routes (grouped layout)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Protected routes
│   │   │   ├── layout.tsx       # Auth guard
│   │   │   └── page.tsx         # Todo list
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── EditTodoForm.tsx
│   │   └── ui/                  # Shared UI components
│   ├── lib/
│   │   ├── auth.ts              # Better Auth configuration
│   │   └── api.ts               # API client with JWT attachment
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── hooks/
│       └── useAuth.ts           # Authentication state hook
├── package.json
├── next.config.js
├── tailwind.config.ts
└── .env.local
```

**Structure Decision**: Monorepo with backend/frontend directories. Backend uses layered architecture (models → schemas → services → API). Frontend uses Next.js App Router with route groups for auth/dashboard separation. Better Auth configured for client-side session management; JWT extracted and sent to API.

---

## API Endpoints

### Authentication Endpoints (Public)

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| POST | /auth/register | Create new account | {email, password} | {user, token} |
| POST | /auth/login | Authenticate user | {email, password} | {user, token} |

### Todo Endpoints (Protected - require JWT)

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| GET | /todos | List user's todos | (none) | [{id, title, description, completed, created_at}] |
| POST | /todos | Create new todo | {title, description?} | {id, title, description, completed, created_at} |
| GET | /todos/{id} | Get single todo | (URL param) | {id, title, description, completed, created_at} |
| PUT | /todos/{id} | Update todo | {title?, description?, completed?} | {id, title, description, completed, created_at} |
| DELETE | /todos/{id} | Delete todo | (URL param) | 204 No Content |
| PATCH | /todos/{id}/complete | Mark complete | (URL param) | {id, title, description, completed, created_at} |

### Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Validation error (missing fields, invalid email format, short password) |
| 401 | Missing or invalid JWT token |
| 403 | Attempt to access another user's resource |
| 404 | Resource not found (todo or user) |
| 409 | Email already exists (registration) |

---

## Data Model

See `data-model.md` for complete entity definitions and Pydantic schemas.

## Quickstart

See `quickstart.md` for setup instructions.

## Next Steps

Run `/sp.tasks` to generate the implementation task list for Phase II features.
