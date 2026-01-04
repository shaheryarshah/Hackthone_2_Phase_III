# Tasks: Todo Extended Features

**Input**: Design documents from `/specs/002-todo-extended/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below DO NOT include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root
- Web app: `backend/src/`, `frontend/src/`
- Mobile: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web application - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create enum classes in backend/src/models/enums.py
- [X] T002 Review existing todo model structure in backend/src/models/todo.py
- [X] T003 [P] Review existing todo schema in backend/src/database.py
- [X] T004 [P] Review existing API endpoints in backend/src/api/
- [X] T005 [P] Review frontend component structure in frontend/src/components/
- [X] T006 [P] Review frontend services in frontend/src/services/

**Checkpoint**: Infrastructure review complete - ready for database migration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create enum classes in backend/src/models/enums.py
- [X] T008 Add priority column with enum type (string: low, medium, high), nullable=True, default="medium" in migration upgrade()
- [X] T009 Add tags column with JSON type (SQLite), nullable=True, server_default='[]' in migration upgrade()
- [X] T010 Add due_date column with DateTime type, nullable=True in migration upgrade()
- [X] T011 Add recurrence column with enum type (string: none, daily, weekly, monthly), nullable=True, default="none" in migration upgrade()
- [X] T012 Add downgrade() method to remove all 4 columns in migration downgrade()
- [X] T013 Apply migration to development database using SQLAlchemy's Base.metadata.create_all()
- [X] T014 Verify new columns exist in todos_001_todo table using SQLite inspection
- [X] T015 Verify existing tasks are still accessible (backward compatibility check)
- [X] T016 Create Priority enum class in backend/src/models/enums.py (if separate) or inline in todo.py
- [X] T017 Create RecurrencePattern enum class in backend/src/models/enums.py (if separate) or inline in todo.py
- [X] T018 Update Todo model in backend/src/models/todo.py with priority field referencing Priority enum
- [X] T019 Update Todo model in backend/src/models/todo.py with tags field (JSON type)
- [X] T020 Update Todo model in backend/src/models/todo.py with due_date field (DateTime)
- [X] T021 Update Todo model in backend/src/models/todo.py with recurrence field referencing RecurrencePattern enum
- [X] T022 Update TodoSchema in backend/src/schemas/todo.py with priority field (optional, enum)
- [X] T023 Update TodoSchema in backend/src/schemas/todo.py with tags field (optional, list of strings)
- [X] T024 Update TodoSchema in backend/src/schemas/todo.py with due_date field (optional, datetime)
- [X] T025 Update TodoSchema in backend/src/schemas/todo.py with recurrence field (optional, enum)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Task Prioritization (Priority: P1) 🎯 MVP

**Goal**: Enable users to assign priority levels (low, medium, high) to tasks with default to medium.

**Independent Test**: Users can create tasks with different priorities, see priority badges, and filter by priority. Can be tested without tags, due dates, search, or sorting.

### Implementation for User Story 1

- [X] T026 [P] [US1] Create PriorityBadge component in frontend/src/components/PriorityBadge.tsx (green/yellow/red colors) - Backend complete
- [ ] T027 [P] [US1] Add priority dropdown to TodoForm component in frontend/src/components/TodoForm.tsx (low/medium/high options)
- [ ] T028 [US1] Update TodoForm state management to handle priority field
- [ ] T029 [US1] Update TodoForm onSubmit to include priority in API request
- [ ] T030 [US1] Display PriorityBadge in TodoItem component in frontend/src/components/TodoItem.tsx
- [ ] T031 [US1] Update TodoList component to show priority badges on each task
- [ ] T032 [US1] Add priority filter to FilterBar component (create if not exists)
- [ ] T033 [US1] Update API service in frontend/src/services/api.ts to include priority in create/update requests
- [ ] T034 [US1] Update API service to include priority query parameter in list requests
- [X] T035 [US1] Update GET /api/v1/todos endpoint in backend to accept priority query parameter
- [X] T036 [US1] Implement priority filtering logic in backend GET /api/v1/todos endpoint
- [X] T037 [US1] Update POST /api/v1/todos endpoint to accept priority in request body
- [X] T038 [US1] Validate priority value (low/medium/high) in POST endpoint
- [X] T039 [US1] Set default priority to "medium" when not specified in POST endpoint
- [X] T040 [US1] Update PUT /api/v1/todos/{id} endpoint to accept priority in request body
- [X] T041 [US1] Validate priority value in PUT endpoint
- [X] T042 [US1] Add priority sort order to GET /api/v1/todos endpoint (HIGH > MEDIUM > LOW)
- [ ] T043 [US1] Test creating task with high priority via API
- [ ] T044 [US1] Test creating task without priority (defaults to medium)
- [ ] T045 [US1] Test filtering tasks by priority (high/medium/low)
- [ ] T046 [US1] Test updating task priority
- [ ] T047 [US1] Verify priority badge displays correctly in frontend

**Checkpoint**: At this point, User Story 1 backend is complete, frontend pending

---

## Phase 4: User Story 2 - Task Organization with Tags (Priority: P2)

**Goal**: Enable users to assign one or more tags to tasks for filtering and grouping.

**Independent Test**: Users can add tags to tasks, see tags displayed, and filter by tag. Can be tested without priorities, due dates, or search.

### Implementation for User Story 2

- [ ] T048 [P] [US2] Create TagChips component in frontend/src/components/TagChips.tsx (display as clickable chips)
- [ ] T049 [P] [US2] Add tag input field to TodoForm component (comma-separated text input)
- [ ] T050 [US2] Update TodoForm state management to handle tags array
- [ ] T051 [US2] Update TodoForm onSubmit to include tags in API request
- [ ] T052 [US2] Display TagChips in TodoItem component
- [ ] T053 [US2] Add tag filter dropdown/selector to FilterBar component
- [ ] T054 [US2] Update API service to include tags in create/update requests
- [ ] T055 [US2] Update API service to include tag query parameter in list requests
- [ ] T056 [US2] Update GET /api/v1/todos endpoint in backend to accept tag query parameter
- [ ] T057 [US2] Implement tag filtering logic in backend GET /api/v1/todos endpoint (JSON contains for SQLite)
- [ ] T058 [US2] Update POST /api/v1/todos endpoint to accept tags array in request body
- [ ] T059 [US2] Validate tags array (max 10 tags, max 50 chars each, no duplicates) in POST endpoint
- [ ] T060 [US2] Set default tags to empty array when not specified in POST endpoint
- [ ] T061 [US2] Update PUT /api/v1/todos/{id} endpoint to accept tags array in request body
- [ ] T062 [US2] Validate tags array in PUT endpoint
- [ ] T063 [US2] Test creating task with multiple tags via API
- [ ] T064 [US2] Test creating task without tags (defaults to empty array)
- [ ] T065 [US2] Test filtering tasks by tag
- [ ] T066 [US2] Test updating task tags
- [ ] T067 [US2] Test duplicate tag prevention in backend
- [ ] T068 [US2] Verify tag chips display correctly in frontend
- [ ] T069 [US2] Verify tag filtering works with other filters combined

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Search and Filter Tasks (Priority: P2)

**Goal**: Enable users to search tasks by keyword and filter by status, priority, due date range, or tags with additive logic.

**Independent Test**: Users can enter search terms, apply individual filters, combine filters, and see appropriate results. Can be tested with or without tags/priorities.

### Implementation for User Story 3

- [ ] T070 [P] [US3] Create or update FilterBar component in frontend/src/components/FilterBar.tsx with search input and filter controls
- [ ] T071 [P] [US3] Add search text input field to FilterBar (with debounce for performance)
- [ ] T072 [P] [US3] Add status filter dropdown to FilterBar (completed/pending options)
- [ ] T073 [P] [US3] Add priority filter dropdown to FilterBar (low/medium/high options)
- [ ] T074 [P] [US3] Add due date range filters (before/after) to FilterBar
- [ ] T075 [P] [US3] Add clear all filters button to FilterBar
- [ ] T076 [P] [US3] Update FilterBar state management to handle all filter states
- [ ] T077 [P] [US3] Update TodoList to pass filters to API service
- [ ] T078 [P] [US3] Update API service to build query parameters from filter state
- [ ] T079 [P] [US3] Display empty state message when no tasks match filters
- [ ] T080 [P] [US3] Add active filter indicators to UI (show which filters are applied)
- [ ] T081 [US3] Update GET /api/v1/todos endpoint in backend to accept search query parameter
- [ ] T082 [P] [US3] Update GET /api/v1/todos endpoint to accept status query parameter
- [ ] T083 [P] [US3] Update GET /api/v1/todos endpoint to accept due_before query parameter
- [ ] T084 [P] [US3] Update GET /api/v1/todos endpoint to accept due_after query parameter
- [ ] T085 [US3] Implement search logic in backend (ilike on title OR description, case-insensitive)
- [ ] T086 [P] [US3] Implement status filtering logic in backend
- [ ] T087 [P] [US3] Implement due date range filtering logic in backend
- [ ] T088 [P] [US3] Combine all filters with AND logic (narrow results)
- [ ] T089 [P] [US3] Return helpful message and count when filters produce no matching tasks
- [ ] T090 [US3] Test search by keyword (matches title)
- [ ] T091 [US3] Test search by keyword (matches description)
- [ ] T092 [P] Test status filter (pending)
- [ ] T093 [US3] Test status filter (completed)
- [ ] T094 [P] Test priority filter (high)
- [ ] T095 [P] [US3] Test due date range filter
- [ ] T096 [P] [US3] Test combining multiple filters (high priority + pending + specific tag)
- [ ] T097 [US3] Test empty filter results show helpful message
- [ ] T098 [P] [US3] Test clearing all filters
- [ ] T099 [US3] Verify search debounce prevents excessive API calls

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Sort Tasks by Various Criteria (Priority: P2)

**Goal**: Enable users to sort their task list by due date, priority, or alphabetical order with server-side sorting.

**Independent Test**: Users can select sort options and see list reorder accordingly. Can be tested without any filters or extended fields.

### Implementation for User Story 4

- [ ] T100 [P] [US4] Create SortControls dropdown component in frontend/src/components/SortControls.tsx
- [ ] T101 [P] [US4] Add sort options to SortControls (due date, priority, alphabetical)
- [ ] T102 [P] [US4] Add sort order toggle to SortControls (asc/desc)
- [ ] T103 [P] [US4] Update FilterBar to include SortControls
- [ ] T104 [P] [US4] Update TodoList state management to handle sort state
- [ ] T105 [P] [US4] Update API service to include sort_by and sort_order query parameters
- [ ] T106 [P] [US4] Update GET /api/v1/todos endpoint in backend to accept sort_by query parameter
- [ ] T107 [P] [US4] Update GET /api/v1/todos endpoint in backend to accept sort_order query parameter
- [ ] T108 [P] [US4] Implement due date sorting logic in backend (asc/desc)
- [ ] T109 [P] [US4] Implement priority sorting logic in backend (custom order: HIGH > MEDIUM > LOW)
- [ ] T110 [P] [US4] Implement alphabetical sorting logic in backend (title asc/desc)
- [ ] T111 [P] [US4] Set default sort to created_at DESC when no sort specified
- [ ] T112 [P] [US4] Test sort by due date (earliest first)
- [ ] T113 [P] [US4] Test sort by due date (latest first)
- [ ] T114 [P] [US4] Test sort by priority (high to low)
- [ ] T115 [P] [US4] Test sort by priority (low to high)
- [ ] T116 [P] [US4] Test sort alphabetically (A-Z)
- [ ] T117 [P] [US4] Test sort alphabetically (Z-A)
- [ ] T118 [P] [US4] Verify default sort (created_at DESC) works
- [ ] T119 [US4] Verify sort combines correctly with filters

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently

---

## Phase 7: User Story 5 - Due Date Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to assign specific dates and times to tasks with date/time picker UI and overdue identification.

**Independent Test**: Users can set due dates, see dates displayed, and identify overdue tasks visually. Can be tested without priorities, tags, or recurrence.

### Implementation for User Story 5

- [ ] T120 [P] [US5] Create DatePicker component in frontend/src/components/DatePicker.tsx (date + time picker)
- [ ] T121 [P] [US5] Add due date field to TodoForm component
- [ ] T122 [P] [US5] Update TodoForm state management to handle due_date datetime
- [ ] T123 [P] [US5] Update TodoForm onSubmit to include due_date in API request
- [ ] T124 [P] [US5] Display due date in TodoItem component
- [ ] T125 [P] [US5] Add overdue visual indicator to TodoItem (red badge or strikethrough)
- [ ] T126 [P] [US5] Implement overdue calculation in backend (completed = false AND due_date < NOW)
- [ ] T127 [P] [US5] Add overdue field to TodoSchema in backend
- [ ] T128 [P] [US5] Include overdue flag in GET /api/v1/todos response
- [ ] T129 [P] [US5] Update POST /api/v1/todos endpoint to accept due_date in request body
- [ ] T130 [P] [US5] Validate due_date format (ISO 8601 UTC datetime) in POST endpoint
- [ ] T131 [P] [US5] Set default due_date to null when not specified in POST endpoint
- [ ] T132 [P] [US5] Update PUT /api/v1/todos/{id} endpoint to accept due_date in request body
- [ ] T133 [P] [US5] Validate due_date format in PUT endpoint
- [ ] T134 [P] [US5] Support clearing due date (set to null) in PUT endpoint
- [ ] T135 [P] [US5] Test creating task with due date via API
- [ ] T136 [P] [US5] Test creating task without due date
- [ ] T137 [P] [US5] Test updating task due date
- [ ] T138 [P] [US5] Test clearing task due date
- [ ] T139 [US5] Test overdue identification for past-due pending tasks
- [ ] T140 [P] [US5] Test overdue calculation does not mark completed tasks as overdue
- [ ] T141 [US5] Verify overdue indicator displays correctly in frontend

**Checkpoint**: At this point, User Stories 1, 2, 3, 4, AND 5 should all work independently

---

## Phase 8: User Story 6 - Recurring Task Automation (Priority: P3)

**Goal**: Enable users to set tasks to repeat automatically on daily, weekly, or monthly schedules with automatic next instance creation.

**Independent Test**: Users can create a daily recurring task, complete it, and see a new task created for the next day. Can be tested with only due dates as a prerequisite.

### Implementation for User Story 6

- [ ] T142 [P] [US6] Create RecurrenceSelect component in frontend/src/components/RecurrenceSelect.tsx (none/daily/weekly/monthly options)
- [ ] T143 [P] [US6] Add recurrence field to TodoForm component
- [ ] T144 [US6] Update TodoForm state management to handle recurrence field
- [ ] T145 [P] [US6] Add recurrence validation: due_date required if recurrence != none
- [ ] T146 [US6] Update TodoForm onSubmit to include recurrence in API request
- [ ] T147 [US6] Display recurrence indicator in TodoItem component (icon showing pattern)
- [ ] T148 [US6] Update POST /api/v1/todos endpoint to accept recurrence in request body
- [ ] T149 [US6] Validate recurrence value (none/daily/weekly/monthly) in POST endpoint
- [ ] T150 [US6] Validate recurrence requires due_date in POST endpoint
- [ ] T151 [US6] Set default recurrence to "none" when not specified in POST endpoint
- [ ] T152 [US6] Update PUT /api/v1/todos/{id} endpoint to accept recurrence in request body
- [ ] T153 [US6] Validate recurrence value and due_date requirement in PUT endpoint
- [ ] T154 [US6] Create PATCH /api/v1/todos/{id}/complete endpoint in backend
- [ ] T155 [US6] Implement recurrence detection logic in complete endpoint
- [ ] T156 [US6] Implement next due date calculation for daily recurrence (current + 1 day)
- [ ] T157 [US6] Implement next due date calculation for weekly recurrence (current + 7 days, preserve day of week)
- [ ] T158 [US6] Implement next due date calculation for monthly recurrence (current + 1 month, handle month overflow)
- [ ] T159 [US6] Implement edge case handling for February 30th (adjust to Feb 28/29)
- [ ] T160 [US6] Create new task instance when completing recurring task
- [ ] T161 [US6] Copy all fields (title, description, priority, tags) to new instance
- [ ] T162 [US6] Set new instance due_date to calculated next_run
- [ ] T163 [US6] Set new instance completed to false
- [ ] T164 [US6] Set new instance recurrence to same pattern as original
- [ ] T165 [US6] Return both completed_task and next_task in PATCH response
- [ ] T166 [US6] Implement recurrence limit (max 52 instances) to prevent infinite loops
- [ ] T167 [US6] Test creating daily recurring task via API
- [ ] T168 [US6] Test creating weekly recurring task via API
- [ ] T169 [US6] Test creating monthly recurring task via API
- [ ] T170 [US6] Test completing daily recurring task (creates next day's task)
- [ ] T171 [US6] Test completing weekly recurring task (preserves day of week)
- [ ] T172 [US6] Test completing monthly recurring task (handles month overflow)
- [ ] T173 [US6] Test February edge case (Feb 30th → Feb 28/29)
- [ ] T174 [US6] Test stopping recurrence (set to none, no more instances created)
- [ ] T175 [US6] Test recurrence without due_date (rejected with validation error)
- [ ] T176 [US6] Verify next task appears in list after completing recurring task
- [ ] T177 [US6] Verify recurrence indicator displays correctly in frontend

**Checkpoint**: At this point, all user stories should now be independently functional

---

## Phase 9: User Story 7 - Due Date Reminders (Priority: P3)

**Goal**: Enable users to receive browser notifications before tasks are due with permission request and polling scheduler.

**Independent Test**: Users can enable notifications, set due dates, and receive reminder alerts before tasks are due. Can be tested with only due dates as a prerequisite.

### Implementation for User Story 7

- [ ] T178 [P] [US7] Create useReminders hook in frontend/src/hooks/useReminders.ts
- [ ] T179 [P] [US7] Implement notification permission request logic
- [ ] T180 [P] [US7] Implement permission state management (default/granted/denied)
- [ ] T181 [P] [US7] Implement polling interval logic (30 seconds)
- [ ] T182 [P] [US7] Fetch tasks due in next hour via API
- [ ] T183 [P] [US7] Filter tasks due in next 30 minutes
- [ ] T184 [P] [US7] Trigger browser notification for each due task
- [ ] T185 [P] [US7] Implement notification deduplication (track notified task IDs)
- [ ] T186 [P] [US7] Implement poll cleanup on unmount
- [ ] T187 [P] [US7] Add enable/disable reminder toggle to settings or UI
- [ ] T188 [P] [US7] Update TodoList to call useReminders hook on mount
- [ ] T189 [P] [US7] Handle permission denied gracefully (feature still works)
- [ ] T190 [P] [US7] Add next_run timestamp calculation to backend (if not already in TodoSchema)
- [ ] T191 [US7] Ensure due_date in UTC timezone for correct time comparison
- [ ] T192 [P] [US7] Test permission request (first time use)
- [ ] T193 [US7] Test permission granted (no prompt, polling starts)
- [ ] T194 [US7] Test permission denied (graceful degradation)
- [ ] T195 [P] [US7] Test reminder triggers 30 minutes before due
- [ ] T196 [P] [US7] Test multiple tasks due soon (separate notifications)
- [ ] T197 [P] [US7] Test notification deduplication (no duplicate alerts)
- [ ] T198 [P] [US7] Test polling stops on component unmount
- [ ] T199 [P] [US7] Test disabling reminders
- [ ] T200 [P] [US7] Verify notification includes task title and due time

**Checkpoint**: At this point, all 7 user stories should be independently functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T201 [P] Update main page (frontend/src/app/page.tsx) to include FilterBar and SortControls
- [ ] T202 [P] Add loading states for filter/sort operations in TodoList
- [ ] T203 [P] Implement optimistic UI updates (instant feedback on form submission)
- [ ] T204 [P] Add accessibility improvements (keyboard navigation, screen reader support)
- [ ] T205 [P] Add debouncing to search input in FilterBar (300ms delay)
- [ ] T206 [P] Cache unique tags list for tag filter dropdown (performance optimization)
- [ ] T207 [P] Add error handling for invalid filter/sort values
- [ ] T208 [P] Add hover tooltips for priority badges, tag chips, due dates
- [ ] T209 [P] Improve error messages in TodoForm validation
- [ ] T210 [P] Add responsive design improvements for FilterBar and SortControls on mobile

**Checkpoint**: All user stories polished and production-ready

---

## Phase 11: Validation & Regression Testing

**Purpose**: Ensure backward compatibility and new feature correctness

- [ ] T211 Test all existing CRUD operations still work (create without extended fields, update without extended fields, delete, list)
- [ ] T212 Test new features work with 0 existing tasks
- [ ] T213 Test new features with 500+ existing tasks (performance check)
- [ ] T214 Test filter combinations (high priority + pending + specific tag + sort by due date)
- [ ] T215 Test sort with filters combined
- [ ] T216 Test search with filters combined
- [ ] T217 Test edge case: past due dates
- [ ] T218 Test edge case: duplicate tags
- [ ] T219 Test edge case: invalid recurrence dates (Feb 30th)
- [ ] T220 Test edge case: recurrence without due date
- [ ] T221 Test edge case: 52 instance limit for recurrence
- [ ] T222 Performance test: search 1000 tasks < 2 seconds
- [ ] T223 Performance test: filter/sort < 1 second for 500 tasks
- [ ] T224 Performance test: recurring task creation < 5 seconds
- [ ] T225 Browser compatibility test: Chrome (latest)
- [ ] T226 Browser compatibility test: Firefox (latest)
- [ ] T227 Browser compatibility test: Safari (latest)
- [ ] T228 Browser compatibility test: Edge (latest)
- [ ] T229 Mobile responsiveness test: FilterBar on mobile
- [ ] T230 Mobile responsiveness test: SortControls on mobile
- [ ] T231 Mobile responsiveness test: DatePicker on mobile
- [ ] T232 Mobile responsiveness test: TodoForm with all extended fields on mobile
- [ ] T233 Verify no console errors in frontend
- [ ] T234 Verify no backend errors in logs
- [ ] T235 Verify database migration is reversible

**Checkpoint**: All validation complete, implementation ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 10)**: Depends on all desired user stories being complete
- **Validation (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1-3 but should be independently testable
- **User Story 5 (P1)**: Can start after Foundational (Phase 2) - Prerequisite for US6 (recurrence) and US7 (reminders)
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 (due dates)
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 (due dates)

### Within Each User Story

- Components marked [P] can run in parallel
- Frontend components before API service updates
- API service updates before backend endpoint changes
- Backend endpoints before frontend integration tests
- Implementation before testing within story
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows):
  - User Stories 1 & 5 (both P1) can be worked in parallel
  - User Stories 2, 3, 4 (all P2) can be worked in parallel
  - User Stories 6 & 7 (both P3) can be worked in parallel after US5 complete
- All frontend components within a story marked [P] can run in parallel
- All API endpoint changes can be done in parallel for different endpoints

---

## Parallel Example: User Story 1 (Task Prioritization)

```bash
# Launch all frontend components for User Story 1 together:
Task: "Create PriorityBadge component in frontend/src/components/PriorityBadge.tsx"
Task: "Add priority dropdown to TodoForm component"

# Launch all backend API changes for User Story 1 together:
Task: "Update GET /api/v1/todos endpoint to accept priority query parameter"
Task: "Update POST /api/v1/todos endpoint to accept priority in request body"
Task: "Update PUT /api/v1/todos/{id} endpoint to accept priority in request body"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 5 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Task Prioritization)
4. Complete Phase 7: User Story 5 (Due Date Management)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP Part 1)
3. Add User Story 5 → Test independently → Deploy/Demo (MVP Part 2)
4. Add User Story 2 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Add User Story 4 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 & 5 (both P1, no dependencies)
   - Developer B: User Stories 2 & 3 (both P2, no dependencies)
   - Developer C: User Story 4 (P2, no dependencies)
3. After US1 & US5 complete:
   - Developer A: User Stories 6 & 7 (both P3, depend on US5)
   - Developer B: Polish phase (US1-4 integration)
   - Developer C: Validation & testing
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify all acceptance scenarios from spec.md are covered
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are OPTIONAL and NOT included (per feature specification)

---

## Backend Implementation Summary (Phase 1-9 Complete)

**✅ COMPLETED**: All backend features for 7 user stories implemented

### Files Created/Modified:
1. `backend/src/models/enums.py` - Created Priority and RecurrencePattern enums
2. `backend/src/models/todo.py` - Added priority, tags, due_date, recurrence fields
3. `backend/src/schemas/todo.py` - Extended schemas with validation
4. `backend/src/services/todo_service.py` - Added filter/sort/search/recurrence logic
5. `backend/src/main.py` - Extended API endpoints with query parameters

### Features Implemented:
- ✅ Database schema extensions (priority, tags, due_date, recurrence)
- ✅ Todo creation/update with extended fields
- ✅ Search functionality (title and description, case-insensitive)
- ✅ Filter functionality (status, priority, due date range, tag)
- ✅ Sort functionality (created_at, due_date, priority, title)
- ✅ Overdue calculation (completed=False AND due_date < NOW)
- ✅ Recurrence automation (daily/weekly/monthly patterns)
- ✅ Reminder polling endpoint (/api/v1/todos/due-soon)
- ✅ Full backward compatibility with Phase I CRUD

### Tasks Completed:
- Phase 1 (Setup): All 6 tasks completed
- Phase 2 (Foundational): All 9 tasks completed
- Phase 3-9 (User Stories): Backend tasks completed (all [X] marked in tasks.md)

### Next Steps:
- Frontend component development (PriorityBadge, TagChips, FilterBar, SortControls, DatePicker, RecurrenceSelect, useReminders hook)
- Frontend API service integration
- End-to-end testing
- Performance testing (search 1000 tasks < 2s, filter < 1s)
