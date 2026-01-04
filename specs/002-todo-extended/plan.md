# Implementation Plan: Todo Extended Features

**Branch**: `002-todo-extended` | **Date**: 2026-01-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-todo-extended/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan extends the existing todo full-stack application with 7 usability and intelligent features: task priorities, tags/categories, search & filtering, sorting, due dates, recurring tasks, and time reminders. All features are opt-in and maintain 100% backward compatibility with existing CRUD operations. The implementation follows the Phase II constitution principles with server-side filtering/sorting, backend business logic, and non-destructive defaults.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5+ (frontend via Next.js)
**Primary Dependencies**: FastAPI (backend), Next.js 14.1 (frontend), SQLAlchemy (database), React 18 (UI)
**Storage**: SQLite for development (todos.db), PostgreSQL/Neon support for production
**Testing**: pytest (backend), Jest/React Testing Library (frontend) - optional per user
**Target Platform**: Web application - server runs on Linux/Docker, client runs in modern browsers (Chrome/Firefox/Safari/Edge)
**Project Type**: web - backend and frontend are completely separated
**Performance Goals**: Filter/sort operations under 1 second for up to 500 tasks, search returns in under 2 seconds for 1000+ tasks
**Constraints**: <200ms p95 for list retrieval with filters, <5 seconds for recurring task auto-creation, backward compatibility with existing APIs required
**Scale/Scope**: Single database per user, supports thousands of tasks per user, 100% feature opt-in (no forced migrations)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Gate (Pre-Research)

✅ **Spec-Driven Development**: All features are derived from approved specification (specs/002-todo-extended/spec.md)
✅ **Strict Separation of Concerns**: All business logic, validation, and filtering/sorting in backend; frontend is thin display layer
✅ **API-First Architecture**: All new features exposed through REST endpoints; frontend never bypasses API
✅ **Input Validation on Backend**: All new fields validated server-side with appropriate HTTP status codes
✅ **Proper Error Handling**: All new endpoints return proper status codes with error messages
✅ **Clean Architecture**: New models, services, and API routes follow existing patterns with clear separation
✅ **Backward Compatibility**: All schema changes are additive only; existing CRUD operations remain unchanged
✅ **Quality Rules**:
  - Features are optional per task
  - Defaults are safe (medium priority, no recurrence)
  - Filters/sorting are server-driven
  - All business logic in backend
  - No breaking changes to existing CRUD

**Result**: All gates PASSED - proceed to Phase 0 research

---

### Final Gate (Post-Design)

✅ Re-evaluated after data-model and contracts generation
✅ All technical decisions align with constitution principles
✅ No violations detected; no complexity tracking required

**Result**: All gates PASSED - design approved for implementation

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-extended/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── create-todo.yaml
│   ├── update-todo.yaml
│   ├── list-todos.yaml
│   ├── search-todos.yaml
│   └── patch-todo-complete.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── todo.py              # MODIFIED: Add priority, tags, due_date, recurrence fields
│   │   └── recurrence.py         # NEW: Handle recurring task patterns
│   ├── services/
│   │   ├── __init__.py
│   │   ├── todo_service.py      # MODIFIED: Add search/filter/sort logic
│   │   └── recurrence_service.py # NEW: Auto-create next instances
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── todo.py              # MODIFIED: Extended with new fields
│   │   └── filter.py            # NEW: Search/filter/sort request schemas
│   └── api/
│       ├── __init__.py
│       └── todos.py              # MODIFIED: Add query parameters for search/filter/sort
├── alembic/                            # Database migrations
│   ├── versions/
│   │   └── 002_add_extended_todo_fields.py  # NEW: Add priority, tags, etc.
│   └── env.py
└── tests/
    ├── unit/
    │   ├── test_todo_model.py
    │   ├── test_recurrence_service.py
    │   └── test_filter_logic.py
    └── integration/
        └── test_todos_api.py

frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx               # MODIFIED: Add filter/sort controls
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── TodoForm.tsx          # MODIFIED: Add priority, tags, due date inputs
│   │   ├── TodoItem.tsx           # MODIFIED: Display priority, tags, due date, overdue indicator
│   │   ├── TodoList.tsx           # MODIFIED: Add filter/sort UI controls
│   │   ├── PriorityBadge.tsx      # NEW: Visual priority indicator
│   │   ├── TagChips.tsx          # NEW: Display tags as chips
│   │   ├── FilterBar.tsx           # NEW: Search input and filter controls
│   │   ├── SortControls.tsx        # NEW: Sort dropdown
│   │   ├── DatePicker.tsx           # NEW: Due date/time picker
│   │   └── RecurrenceSelect.tsx    # NEW: Recurrence pattern selector
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useReminders.ts        # NEW: Browser notification hook
│   ├── lib/
│   │   └── api.ts                 # MODIFIED: Add search/filter/sort query params
│   └── types/
│       └── index.ts                # MODIFIED: Extended Todo interface
└── tests/
    ├── components/
    │   ├── TodoForm.test.tsx
    │   ├── FilterBar.test.tsx
    │   └── RecurrenceSelect.test.tsx
    └── integration/
        └── api.test.ts
```

**Structure Decision**: Web application with separate backend (FastAPI) and frontend (Next.js). This matches the existing Phase I architecture and follows constitution's "Strict Separation of Concerns" principle. Backend owns all business logic including search, filter, sort, and recurrence. Frontend is a thin display layer with no business logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected - complexity tracking not required. All features align with constitution principles and existing architecture patterns.

---

## Phase 0: Research & Technology Decisions

### Research Summary (Full Details: research.md)

This phase resolved all technology decisions and clarified implementation approaches for extended features. Key decisions:

1. **Database Schema Evolution**: Additive-only changes using Alembic migrations (SQLite/PostgreSQL compatible)
2. **Search Implementation**: Full-text search using SQLAlchemy's `ilike` operator (PostgreSQL: `ilike` → faster, production: add GIN indexes)
3. **Filter/Sort Strategy**: Server-side using SQLAlchemy Query API with dynamic filter building
4. **Tag Storage**: JSON array column in SQLite (simple), array type in PostgreSQL (better performance)
5. **Recurrence Logic**: Background task processor vs. immediate post-completion hook → chose immediate hook for simplicity
6. **Reminder Implementation**: Frontend browser notifications with next_run timestamp polling (server-driven)

**See**: [research.md](research.md) for complete decision rationale and alternatives considered

## Phase 1: Design & Contracts

### Data Model (Full Details: data-model.md)

Extended Todo model with backward-compatible additive fields:

**Todo Entity Additions**:
- `priority`: Enum (low, medium, high), nullable, default="medium"
- `tags`: Array of strings (JSON in SQLite, array in PostgreSQL), nullable, default=[]
- `due_date`: DateTime, nullable
- `recurrence`: Enum (none, daily, weekly, monthly), nullable, default="none"

**Constraints**:
- All new fields are optional (nullable)
- Defaults are safe (medium priority, no recurrence)
- No existing columns removed or renamed
- Backward compatibility: existing todos work without new fields

**See**: [data-model.md](data-model.md) for complete schema diagram and validation rules

### API Contracts (Full Details: contracts/)

RESTful API extensions preserving existing contracts:

**Modified Endpoints** (additive changes only):
- `POST /api/v1/todos`: Accept optional `priority`, `tags`, `due_date`, `recurrence` in request body
- `GET /api/v1/todos`: Add query parameters `search`, `status`, `priority`, `due_before`, `due_after`, `tag`, `sort_by`, `sort_order`
- `PUT /api/v1/todos/{id}`: Allow updating `priority`, `tags`, `due_date`, `recurrence`
- `PATCH /api/v1/todos/{id}/complete`: Trigger recurrence check if task has recurrence pattern

**New Behavior**:
- All existing endpoints continue to work without new parameters
- Filters are additive (AND logic)
- Sort defaults to `created_at DESC`
- Empty search/filter returns helpful message with option to clear filters

**See**: [contracts/](contracts/) directory for OpenAPI/YAML specifications

### Quickstart Guide (Full Details: quickstart.md)

Step-by-step guide for developers to set up and test extended features:

1. Database migration setup
2. Backend endpoint testing with examples
3. Frontend component integration guide
4. Testing search/filter/sort combinations
5. Recurring task workflow demonstration
6. Reminder permission and testing

**See**: [quickstart.md](quickstart.md) for complete getting-started documentation

---

## Implementation Phases

### Phase 2: Database Migration (Blocking)

**Purpose**: Extend schema with backward-compatible changes

**Tasks**:
1. Create Alembic migration to add new columns to `todos_001_todo` table
2. Test migration on development SQLite database
3. Verify existing todos still accessible (backward compatibility check)
4. Document migration for PostgreSQL production

**Output**: Database schema ready for extended features

### Phase 3: Backend API Extensions (Blocking)

**Purpose**: Implement server-side search, filter, sort, and recurrence logic

**Tasks**:
1. Update Todo model with new fields and enum types
2. Update TodoSchema to include new optional fields
3. Add filter schemas for query parameters
4. Implement search/filter/sort logic in TodoService
5. Implement recurrence auto-creation service
6. Extend todo endpoints with query parameter handling
7. Add unit tests for filter/sort logic
8. Add integration tests for API with filters

**Output**: Backend ready with all extended features

### Phase 4: Frontend UI Components (Parallel by User Story)

**Purpose**: Build thin client UI for each feature independently

**User Story 1 - Task Prioritization**:
1. Create PriorityBadge component (low/medium/high colors)
2. Add priority dropdown to TodoForm
3. Display priority in TodoItem
4. Filter by priority in FilterBar

**User Story 2 - Task Organization with Tags**:
1. Create TagChips component (clickable tags)
2. Add tag input to TodoForm (comma-separated or chip selector)
3. Display tags in TodoItem
4. Filter by tag in FilterBar

**User Story 3 - Search and Filter Tasks**:
1. Create FilterBar component with search input and filter controls
2. Add query state management for filters
3. Display empty state message for no results
4. Clear all filters button

**User Story 4 - Sort Tasks**:
1. Create SortControls dropdown component
2. Sort by due date, priority, alphabetical options
3. Update API calls with sort query parameters
4. Display current sort indicator

**User Story 5 - Due Date Management**:
1. Create DatePicker component (date + time picker)
2. Add due date field to TodoForm
3. Display due date in TodoItem
4. Visual overdue indicator (red badge or strikethrough)

**User Story 6 - Recurring Task Automation**:
1. Create RecurrenceSelect component (none/daily/weekly/monthly)
2. Add recurrence field to TodoForm
3. Show recurrence indicator in TodoItem
4. Test auto-creation workflow (complete task → new task appears)

**User Story 7 - Due Date Reminders**:
1. Create useReminders hook for browser notifications
2. Request notification permission on first use
3. Poll for due tasks and trigger notifications
4. Add reminder enable/disable toggle

**Output**: Frontend UI components for all 7 features, independently testable

### Phase 5: Integration & Polish

**Purpose**: Connect backend and frontend, ensure quality

**Tasks**:
1. Update API service calls to include query parameters
2. Add error handling for empty filter results
3. Add loading states for filter/sort operations
4. Implement optimistic UI updates (instant feedback)
5. Accessibility improvements (keyboard nav, screen reader support)
6. Performance optimization (debounce search input, cache tag lists)

**Output**: Fully integrated and polished extended features

### Phase 6: Validation & Regression Testing

**Purpose**: Ensure backward compatibility and new feature correctness

**Tasks**:
1. Test all existing CRUD operations still work
2. Test new features with 0 existing tasks
3. Test new features with 500+ existing tasks
4. Test filter combinations (high priority + pending + specific tag)
5. Test edge cases (past due dates, duplicate tags, invalid recurrence dates)
6. Performance testing (search 1000 tasks < 2s, filter < 1s)
7. Browser compatibility testing (Chrome, Firefox, Safari, Edge)
8. Mobile responsiveness testing (filter bar, due date picker)

**Output**: Validated implementation ready for deployment

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|-------|-----------|---------|-------------|
| Database migration fails in production | Low | High | Test migration on copy of production DB first; have rollback plan |
| Search performance degrades with many tasks | Medium | Medium | Use database indexes on title, description, priority; add full-text search in PostgreSQL |
| Browser notifications blocked by users | High | Low | Feature degrades gracefully without notifications; provide in-app alternatives |
| Recurrence logic bugs create infinite tasks | Low | High | Add maximum recurrence limit per task (e.g., 52 instances); add admin tools to stop recurrence |
| Filter/sort complexity confuses users | Medium | Medium | Clear UI with active filter indicators; easy clear-all-filters button; helpful empty state message |

---

## Rollback Plan

If critical issues discovered post-deployment:

1. **Database Rollback**: Reverse Alembic migration to remove new columns (existing data preserved)
2. **Feature Flags**: Disable extended features via environment variables or config
3. **Frontend Fallback**: Hide new UI components when backend flags indicate extended features unavailable
4. **API Compatibility**: Keep existing endpoints working without new parameters

**Recovery Time**: < 1 hour for database rollback, < 30 minutes for feature flag toggles

---

## Next Steps

After this plan is approved:

1. Run `/sp.tasks` to generate actionable implementation tasks
2. Execute tasks following prioritization (P1 → P2 → P3)
3. Test each user story independently before combining
4. Update this plan with any design changes discovered during implementation
5. Create ADRs for any significant architectural decisions made during implementation

**Ready for**: `/sp.tasks` command to break down this plan into testable, dependency-ordered tasks
