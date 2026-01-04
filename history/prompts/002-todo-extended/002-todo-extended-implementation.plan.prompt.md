---
id: 001
title: Todo Extended Features Implementation Plan
stage: plan
date: 2026-01-02
surface: agent
model: claude-sonnet-4.5
feature: 002-todo-extended
branch: 002-todo-extended
user: user
command: /sp.plan
labels: ["plan","phase-ii","implementation"]
links:
  spec: ../../specs/002-todo-extended/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-todo-extended/plan.md
 - specs/002-todo-extended/research.md
 - specs/002-todo-extended/data-model.md
 - specs/002-todo-extended/quickstart.md
 - specs/002-todo-extended/contracts/create-todo.yaml
 - specs/002-todo-extended/contracts/update-todo.yaml
 - specs/002-todo-extended/contracts/list-todos.yaml
 - specs/002-todo-extended/contracts/patch-todo-complete.yaml
tests:
 - None
---

## Prompt

3️⃣ Updated Implementation Plan

📄 specs/phase-ii/extended-plan.md

# Phase II Extended Implementation Plan

## Step1: Database Schema Update
- Add priority
- Add tags
- Add due_date
- Add recurrence fields

## Step 2: Backend API Extensions
- Extend create/update endpoints
- Add search, filter, sort parameters
- Add recurrence processing logic

## Step 3: Frontend UI Enhancements
- Priority selector
- Tag input
- Due date picker
- Filter & sort controls

## Step 4: Recurring Task Engine
- Detect completed recurring tasks
- Schedule next instance

## Step5: Reminder System
- Frontend notification scheduler
- Backend due-date support

## Step 6: Validation
- Regression testing existing features
- Validate new features

## Response snapshot

Created comprehensive implementation plan for Phase II extended features:

**Phase 0: Research & Technology Decisions**
- Database Schema Evolution: Alembic migrations with SQLite/PostgreSQL compatibility
- Search Implementation: SQLAlchemy `ilike` operator (SQLite) → GIN indexes (PostgreSQL)
- Tag Storage: JSON array (SQLite) → native array (PostgreSQL)
- Recurrence Trigger: Immediate post-completion hook (synchronous)
- Reminder System: Frontend polling with browser notifications
- Filter/Sort Strategy: Dynamic SQLAlchemy Query builder (server-side)

**Phase 1: Design & Contracts**
- Extended Todo model with 4 new fields (priority, tags, due_date, recurrence)
- All fields are nullable with safe defaults (medium priority, empty tags, no recurrence)
- 4 API contracts defined (create, update, list with filters, complete with recurrence)
- Comprehensive quickstart guide with step-by-step testing instructions
- Agent context updated with new technology stack

**Constitution Check**: All gates PASSED (no violations detected)
- All features are opt-in
- Server-side filtering/sorting ensured
- Backward compatibility maintained (100%)
- Business logic in backend
- All new fields are optional with safe defaults

**Implementation Phases** (6 total):
- Phase 2: Database Migration (Alembic)
- Phase 3: Backend API Extensions (models, schemas, services, endpoints)
- Phase 4: Frontend UI Components (7 user stories, independently testable)
- Phase 5: Integration & Polish
- Phase 6: Validation & Regression Testing

**Risk Analysis**: 5 risks identified with mitigation strategies
- Database migration failure: Rollback plan
- Search performance degradation: Database indexes
- Browser notifications blocked: Graceful degradation
- Recurrence logic bugs: Maximum 52 instances limit
- Filter/sort complexity: Clear UI indicators, helpful empty state

**Rollback Plan**: < 1 hour database rollback, < 30 minutes feature flag toggles

## Outcome

- ✅ Impact: Complete implementation plan with all design artifacts ready for task breakdown
- 🧪 Tests: None (planning phase)
- 📁 Files: 8 design artifacts created (plan, research, data-model, quickstart, 4 contracts)
- 🔁 Next prompts: Use /sp.tasks to generate actionable, dependency-ordered tasks
- 🧠 Reflection: All technology decisions align with constitution; no complexity violations; clear migration path from Phase I

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution gates all PASSED
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
