# Research: Todo Full-Stack Web Application

## Summary

Technical decisions for implementing a Todo Full-Stack Application with FastAPI backend and Next.js frontend.

## Technology Stack Decisions

### Backend Language and Framework

**Decision**: Python 3.11+ with FastAPI

**Rationale**:
- FastAPI is a modern, high-performance web framework for building APIs with Python 3.6+ based on standard Python type hints
- Automatic interactive API documentation (Swagger UI and ReDoc)
- Built-in validation using Pydantic
- Fast execution comparable to Node.js and Go
- Async/await support for handling concurrent requests
- Excellent for REST APIs with automatic OpenAPI schema generation

**Alternatives Considered**:
- Flask: Mature but requires more boilerplate for validation and documentation
- Django: Full-featured but overkill for a simple todo API
- Node.js/Express: Would require JavaScript/TypeScript, not aligned with Python constitution

---

### Database Selection

**Decision**: SQLite for development, PostgreSQL for production

**Rationale**:
- **SQLite**: Zero-configuration, file-based, perfect for development and testing
- **PostgreSQL**: Production-grade relational database with ACID compliance, robust querying
- Both are SQL databases, maintaining consistency in the codebase
- SQLAlchemy as ORM provides abstraction layer, allowing database migration

**Alternatives Considered**:
- MongoDB (NoSQL): Would require learning different query patterns, not justified for structured todo data
- Redis: Good for caching but not suitable as primary data store for persistent todos
- MySQL: Comparable to PostgreSQL, but PostgreSQL has better JSON support for future extensibility

---

### ORM and Database Access

**Decision**: SQLAlchemy 2.0 with Pydantic models

**Rationale**:
- SQLAlchemy is the industry standard ORM for Python
- Provides both ORM (productive) and Core (performant) patterns
- Type-safe query building with mypy support
- Pydantic integration for request/response validation
- Automatic migrations support via Alembic

---

### Frontend Framework

**Decision**: Next.js 14+ with React

**Rationale**:
- Next.js provides server-side rendering and static generation
- App Router for modern React patterns
- Built-in API routes capability (can proxy backend requests)
- Excellent developer experience and tooling
- TypeScript support out of the box

**Alternatives Considered**:
- Plain React: Would require manual routing and SSR setup
- Vue/Nuxt: JavaScript ecosystem, not aligned with Python backend preference
- Svelte: Growing popularity but smaller ecosystem

---

### API Communication

**Decision**: HTTP REST with JSON

**Rationale**:
- Simple, well-understood pattern
- JSON is the universal data interchange format
- Aligns with constitution requirement for REST-based architecture
- Easy to debug and test with tools like curl and Postman

**Alternatives Considered**:
- GraphQL: Overkill for this scope, adds complexity
- gRPC: Not suitable for browser-based clients without gRPC-Web

---

### Validation Strategy

**Decision**: Pydantic models for request validation

**Rationale**:
- Native integration with FastAPI
- Type hints provide both documentation and validation
- Custom validators can be added for complex rules
- Clear error messages with location of validation failure

---

### Testing Strategy

**Decision**: pytest for backend, Jest/Vitest for frontend

**Rationale**:
- pytest is the de facto standard for Python testing
- pytest-cov for coverage reporting
- pytest-asyncio for async test support
- Vitest is fast and integrates well with Next.js/Vite

---

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── api/             # API endpoints
│   ├── services/        # Business logic
│   └── database.py      # DB connection
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── alembic/             # Migrations
├── requirements.txt
└── main.py              # FastAPI app
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── services/        # API client
│   └── types/           # TypeScript types
├── tests/
│   └── ...
├── package.json
└── next.config.js
```

## Key Technical Decisions

### API Design Pattern

RESTful conventions with predictable URL patterns:

| Operation | HTTP Method | URL Pattern |
|-----------|-------------|-------------|
| List todos | GET | /todos |
| Create todo | POST | /todos |
| Get todo | GET | /todos/{id} |
| Update todo | PUT | /todos/{id} |
| Delete todo | DELETE | /todos/{id} |
| Mark complete | PATCH | /todos/{id}/complete |

### Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Todo with id=999 not found"
  }
}
```

### Todo Model Constraints

- **title**: Required, 1-200 characters
- **description**: Optional, 0-5000 characters
- **completed**: Default false
- **created_at**: Auto-generated timestamp

## Out of Scope

- User authentication and authorization
- Todo categories or tags
- Due dates and reminders
- Search and filtering
- Sorting options
- Bulk operations
- Sharing and collaboration
