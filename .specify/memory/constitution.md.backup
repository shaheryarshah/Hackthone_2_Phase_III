<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0 (MINOR: material expansion of quality rules and success criteria)
- Modified principles: None (all original principles preserved)
- Added sections: Backward Compatibility principle, Extended Features scope
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check remains compatible
  ✅ .specify/templates/spec-template.md - Scope/requirements alignment maintained
  ✅ .specify/templates/tasks-template.md - Task categorization still reflects principles
- Follow-up TODOs: None
-->

# Phase II Constitution – Todo Full-Stack Web Application

## Core Principles

### I. Spec-Driven Development

All development MUST begin with a written specification. No code is written until the feature specification (spec.md) is documented and approved. The specification serves as the contract that governs all implementation decisions. Changes to implementation require specification updates first.

**Rationale**: Prevents scope creep, ensures shared understanding, and provides a reference for validation.

### II. Strict Separation of Concerns

Backend and frontend MUST be completely separated. The backend is the single source of truth - it owns all business logic, data validation, and persistence. The frontend is a thin client that only displays data and captures user input. No business logic, data transformation, or validation rules exist in the frontend.

**Rationale**: Enables independent scaling, testing, and evolution of each layer.

### III. API-First Architecture

The REST API is the authoritative contract between client and server. All data flows through well-defined HTTP endpoints. The frontend cannot bypass the API to access data or perform operations. API documentation MUST be maintained alongside code.

**Rationale**: Ensures consistency, enables multiple clients, and provides clear boundaries.

### IV. Input Validation on Backend

All input from the frontend MUST be validated on the backend. Validation includes type checking, range validation, format validation, and business rule enforcement. Invalid input MUST return appropriate HTTP status codes with clear error messages.

**Rationale**: Frontend validation can be bypassed; backend validation is the only reliable defense.

### V. Proper Error Handling

All API endpoints MUST return appropriate HTTP status codes (2xx for success, 4xx for client errors, 5xx for server errors). Error responses MUST include sufficient information for debugging without exposing internal system details. Errors MUST be logged with context for troubleshooting.

**Rationale**: Enables reliable client handling and effective debugging.

### VI. Clean Architecture

Code MUST be organized with clear separation between models, services, and API layers. Each layer has a single responsibility. Dependencies flow inward (API → Service → Model). Testing MUST be possible at each layer in isolation.

**Rationale**: Maintainability, testability, and understandability over time.

### VII. Backward Compatibility

All Phase II features MUST be backward compatible with existing functionality. No breaking changes are allowed to existing CRUD operations or API contracts. Existing database schema MUST be preserved; new fields can be added but existing columns cannot be removed or renamed.

**Rationale**: Ensures existing users and integrations continue to function without interruption during feature rollout.

## Technology Constraints

- **Backend**: Python 3.11+ with FastAPI framework
- **Frontend**: Next.js with React
- **Database**: Single database (SQL or NoSQL) - existing DB schema can evolve but must preserve backward compatibility
- **Communication**: HTTP REST API only
- **No AI agents or MCP tools** are to be used in this phase

## Quality Rules

- All API contracts MUST be documented
- All endpoints MUST have input validation
- All errors MUST return appropriate HTTP status codes
- Frontend and backend MUST run independently
- All CRUD operations MUST persist to the database
- Features MUST be optional per task (no forced opt-in)
- Defaults MUST be safe and non-destructive
- Filters and sorting MUST be server-driven (not client-side)
- All business logic MUST reside in the backend
- No breaking changes to existing CRUD functionality

## Success Criteria

### Phase I (Foundation)
- Web UI can fully manage todos (create, read, update, delete)
- All CRUD operations persist in the database
- Backend and frontend run independently on separate ports
- API serves as the single source of truth

### Phase II (Extended Features)
- Users can organize tasks (tags, categories, or other grouping)
- Users can search tasks by content or metadata
- Users can prioritize tasks (high/medium/low or numeric priority)
- Tasks can recur automatically (daily, weekly, monthly patterns)
- Due dates function correctly and are enforced
- Reminders trigger appropriately for tasks with due dates
- All Phase II features are optional and backward compatible
- Existing CRUD operations remain unchanged and functional

## Governance

The constitution supersedes all other development practices. All changes MUST be documented and approved before implementation. Complexity MUST be justified and simpler alternatives documented when rejected.

Amendments to this constitution require:
1. Clear rationale for the change
2. Impact analysis on existing features
3. Version bump according to semantic versioning rules
4. Documentation of updated principles in plan and spec templates

**Version**: 1.1.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2026-01-02
