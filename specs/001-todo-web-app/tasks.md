---
description: "Task list for Todo Full-Stack Application Phase II - Multi-User Authentication & Persistence"
---

# Tasks: Todo Full-Stack Application (Phase II)

**Input**: Design documents from `/specs/001-todo-web-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Phase**: II - Multi-User Authentication & Persistence

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US5, US6, US7)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup - Phase II Extensions (If Needed)

**Purpose**: Additional project initialization for Phase II authentication features

**Note**: Phase 1 Setup from Phase I is complete (T001-T005). Only add missing Phase II setup tasks.

- [ ] T037 [P] Create backend/.env.example with JWT_SECRET_KEY, DATABASE_URL, JWT_ALGORITHM variables
- [ ] T038 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET

---

## Phase 2: Foundational - Authentication Infrastructure (Phase II)

**Purpose**: Core authentication infrastructure that MUST be complete before ANY Phase II user story can be implemented

**CRITICAL**: No Phase II user story work can begin until this phase is complete

### Backend Authentication Foundation

- [ ] T039 [P] Add bcrypt and python-jose dependencies to backend/requirements.txt
- [ ] T040 [P] Create User SQLModel entity in backend/src/models/user.py (from data-model.md)
- [ ] T041 [P] Create User Pydantic schemas (UserCreate, UserLogin, UserResponse, UserWithToken) in backend/src/schemas/user.py
- [ ] T042 [P] Create auth schemas (TokenResponse, ErrorResponse) in backend/src/schemas/auth.py
- [ ] T043 Create auth_service.py with password hashing and JWT generation in backend/src/services/auth_service.py
- [ ] T044 Create JWT verification middleware/dependency in backend/src/middleware/auth.py
- [ ] T045 Create get_current_user dependency in backend/src/dependencies.py
- [ ] T046 Update database.py to support PostgreSQL connection for Neon (update from SQLite)
- [ ] T047 Update main.py to include auth middleware and CORS configuration

### Frontend Authentication Foundation

- [ ] T048 [P] Create auth TypeScript types in frontend/src/types/auth.ts
- [ ] T049 [P] Install and configure Better Auth in frontend/src/lib/auth.ts
- [ ] T050 Create API client with JWT attachment in frontend/src/lib/api.ts
- [ ] T051 Create useAuth hook for authentication state in frontend/src/hooks/useAuth.ts

**Checkpoint**: Authentication foundation ready - Phase II user story implementation can now begin

---

## Phase 3: User Story 5 - User Registration (Priority: P1) 🎯 Phase II MVP

**Goal**: New users can create an account to access the todo application

**Independent Test**: Can be fully tested by completing registration and verifying the user can log in

### Backend Implementation for User Story 5

- [ ] T052 [P] [US5] Implement POST /auth/register endpoint in backend/src/api/routes/auth.py
- [ ] T053 [US5] Add email uniqueness validation (409 conflict if email exists)
- [ ] T054 [US5] Add email format validation (Pydantic EmailStr)
- [ ] T055 [US5] Add password length validation (min 8 characters)

### Frontend Implementation for User Story 5

- [ ] T056 [P] [US5] Create RegisterForm component in frontend/src/components/auth/RegisterForm.tsx
- [ ] T057 [US5] Integrate Better Auth signUp with email/password
- [ ] T058 [US5] Create registration page at frontend/src/app/(auth)/register/page.tsx
- [ ] T059 [US5] Add redirect to dashboard on successful registration

**Checkpoint**: User Story 5 should be fully functional and testable independently

---

## Phase 4: User Story 6 - User Login (Priority: P1)

**Goal**: Registered users can log in to access their todos

**Independent Test**: Can be fully tested by logging in and accessing the user's todo list

### Backend Implementation for User Story 6

- [ ] T060 [P] [US6] Implement POST /auth/login endpoint in backend/src/api/routes/auth.py
- [ ] T061 [US6] Add password verification against stored bcrypt hash
- [ ] T062 [US6] Return JWT token and user data on successful login
- [ ] T063 [US6] Return 401 error for invalid credentials

### Frontend Implementation for User Story 6

- [ ] T064 [P] [US6] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx
- [ ] T065 [US6] Integrate Better Auth signIn with email/password
- [ ] T066 [US6] Create login page at frontend/src/app/(auth)/login/page.tsx
- [ ] T067 [US6] Store JWT token and redirect to dashboard on successful login
- [ ] T068 [US6] Update api.ts to include JWT in Authorization header for all requests

**Checkpoint**: User Stories 5 AND 6 should both work independently

---

## Phase 5: User Story 7 - User Logout (Priority: P2)

**Goal**: Users can log out to end their authenticated session

**Independent Test**: Can be fully tested by logging out and verifying the user must log in again

### Frontend Implementation for User Story 7

- [ ] T069 [P] [US7] Integrate Better Auth signOut
- [ ] T070 [US7] Create logout button component in frontend/src/components/auth/LogoutButton.tsx
- [ ] T071 [US7] Clear JWT token and redirect to login page on logout
- [ ] T072 [US7] Update dashboard layout to show logout option in frontend/src/app/(dashboard)/layout.tsx

**Checkpoint**: User Story 7 should be fully functional

---

## Phase 6: User Story 1 - Create and View Todos (Updated for Auth - Priority: P1)

**Goal**: Authenticated users can add new todos and view only their own todos

**Independent Test**: Can be fully tested by logging in, adding a todo, and verifying it appears in the list

### Backend Updates for User Story 1 (Authentication Required)

- [ ] T073 [P] [US1] Update GET /todos to require JWT authentication
- [ ] T074 [US1] Update GET /todos to filter by current_user.id (user isolation)
- [ ] T075 [P] [US1] Update POST /todos to require JWT authentication
- [ ] T076 [US1] Update POST /todos to set user_id from JWT token (not from request body)

### Frontend Updates for User Story 1 (Authentication Required)

- [ ] T077 [P] [US1] Protect todo list page at frontend/src/app/(dashboard)/page.tsx
- [ ] T078 [US1] Redirect to login if not authenticated
- [ ] T079 [US1] Update TodoList to show only authenticated user's todos
- [ ] T080 [US1] Update TodoForm to include JWT in API calls

**Checkpoint**: User Story 1 now enforces authentication and user isolation

---

## Phase 7: User Story 2 - Update Todos (Updated for Auth - Priority: P1)

**Goal**: Authenticated users can edit only their own todos

**Independent Test**: Can be fully tested by selecting a todo, modifying its content, and verifying the changes are saved

### Backend Updates for User Story 2 (Authentication + User Isolation)

- [ ] T081 [P] [US2] Update PUT /todos/{id} to require JWT authentication
- [ ] T082 [US2] Update PUT /todos/{id} to verify todo.user_id == current_user.id (return 403 if not owner)
- [ ] T083 [US2] Update GET /todos/{id} to return 403 for todos not owned by user

### Frontend Updates for User Story 2 (Authentication Required)

- [ ] T084 [P] [US2] Update EditTodoForm to include JWT in API calls
- [ ] T085 [US2] Handle 403 error and display "Access denied" message

**Checkpoint**: User Story 2 now enforces authentication and user isolation

---

## Phase 8: User Story 3 - Delete Todos (Updated for Auth - Priority: P2)

**Goal**: Authenticated users can delete only their own todos

**Independent Test**: Can be fully tested by deleting a todo and verifying it no longer appears in the list

### Backend Updates for User Story 3 (Authentication + User Isolation)

- [ ] T086 [P] [US3] Update DELETE /todos/{id} to require JWT authentication
- [ ] T087 [US3] Update DELETE /todos/{id} to verify todo.user_id == current_user.id (return 403 if not owner)

### Frontend Updates for User Story 3 (Authentication Required)

- [ ] T088 [P] [US3] Update delete API method to include JWT in API calls
- [ ] T089 [US3] Handle 403 error and display "Access denied" message

**Checkpoint**: User Story 3 now enforces authentication and user isolation

---

## Phase 9: User Story 4 - Mark Todos Complete (Updated for Auth - Priority: P1)

**Goal**: Authenticated users can mark only their own todos as complete

**Independent Test**: Can be fully tested by marking a todo complete and verifying its status changes

### Backend Updates for User Story 4 (Authentication + User Isolation)

- [ ] T090 [P] [US4] Update PATCH /todos/{id}/complete to require JWT authentication
- [ ] T091 [US4] Update PATCH /todos/{id}/complete to verify todo.user_id == current_user.id (return 403 if not owner)

### Frontend Updates for User Story 4 (Authentication Required)

- [ ] T092 [P] [US4] Update mark complete API method to include JWT in API calls
- [ ] T093 [US4] Handle 403 error and display "Access denied" message

**Checkpoint**: User Story 4 now enforces authentication and user isolation

---

## Phase 10: Polish & Cross-Cutting Concerns (Phase II)

**Purpose**: Improvements that affect multiple user stories

- [ ] T094 [P] Add JWT expiration handling in frontend (refresh token flow if implemented)
- [ ] T095 [P] Add loading states to login/register forms
- [ ] T096 Add proper error messages for auth failures (invalid credentials, session expired)
- [ ] T097 Update quickstart.md with Phase II setup instructions
- [ ] T098 Run end-to-end authentication flow test (register → login → create todo → logout)
- [ ] T099 Test user isolation (create two users, verify they can't see each other's todos)
- [ ] T100 [P] Add input validation error messages to RegisterForm and LoginForm

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (Phase I complete)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all Phase II user stories
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - US5 (Register) and US6 (Login) can proceed in parallel once Foundational is done
  - US7 (Logout) depends on US6 completion (needs login first)
  - US1-US4 updates depend on US5-US6 completion (need authentication)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 5 (P1 - Register)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 6 (P1 - Login)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 7 (P2 - Logout)**: Depends on US6 (Login) completion
- **User Stories 1-4 Updates**: Depend on US5-US6 (Auth flow) completion

### Within Each User Story

- Backend endpoints before frontend integration
- Service methods before endpoints that use them
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Foundational Phase**: T039-T042, T048-T050 can run in parallel
- **User Story 5**: T052-T055 can run in parallel
- **User Story 6**: T060-T063 can run in parallel
- **US5 + US6**: Can run in parallel once Foundational is done
- **User Stories 1-4 Updates**: Can run in parallel (T073-T080, T081-T085, etc.)

---

## Parallel Example: Foundational Phase

```bash
# Launch these tasks together (they're independent):
Task T039: Add bcrypt and python-jose to requirements.txt
Task T040: Create User SQLModel entity
Task T041: Create User Pydantic schemas
Task T042: Create auth schemas
Task T048: Create auth TypeScript types
Task T049: Install Better Auth
Task T050: Create API client with JWT attachment
```

---

## Implementation Strategy

### MVP First (Phase II Auth MVP)

1. Complete Phase 1: Setup (Phase II extensions)
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 5 (Register)
4. Complete Phase 4: User Story 6 (Login)
5. **STOP and VALIDATE**: Test registration and login flow independently
6. Deploy/demo auth MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 5 → Test independently → Deploy/Demo
3. Add User Story 6 → Test independently → Deploy/Demo
4. Add User Story 7 → Test independently → Deploy/Demo
5. Add User Stories 1-4 updates → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 5 (Register)
   - Developer B: User Story 6 (Login)
   - Developer C: User Story 7 (Logout)
3. Once auth stories are done:
   - Developer A: Update User Story 1 (Create/View)
   - Developer B: Update User Story 2 (Update)
   - Developer C: Update User Stories 3-4 (Delete/Complete)
4. Stories complete and integrate independently

---

## Task Summary

| Metric | Count |
|--------|-------|
| Phase II New Tasks | 64 (T037-T100) |
| Phase I Completed Tasks | 36 (T001-T036) |
| Total Tasks | 100 |
| Setup Phase | 2 |
| Foundational Phase | 13 |
| User Story 5 (Register) | 8 |
| User Story 6 (Login) | 9 |
| User Story 7 (Logout) | 4 |
| User Story 1 Update | 7 |
| User Story 2 Update | 5 |
| User Story 3 Update | 4 |
| User Story 4 Update | 4 |
| Polish Phase | 7 |

### Parallel Opportunities

- **Foundational**: T039-T042, T048-T050 can run in parallel
- **User Story 5**: T052-T055 can run in parallel
- **User Story 6**: T060-T063 can run in parallel
- **US1 Updates**: T073, T075, T077, T079, T080 can run in parallel
- **Polish**: T094, T095, T100 can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All Phase II tasks require Phase I Setup + Foundational to be complete first
- User isolation must be tested: create two users, verify they can't see each other's todos
