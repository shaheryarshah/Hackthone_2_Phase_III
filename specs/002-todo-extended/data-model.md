# Data Model: Todo Extended Features

**Feature**: 002-todo-extended
**Date**: 2026-01-02
**Purpose**: Define extended Todo entity with backward-compatible schema for priorities, tags, due dates, and recurrence

## Overview

The Todo model is extended with additive-only fields to support Phase II features while maintaining 100% backward compatibility. All new fields are optional with safe defaults. Existing CRUD operations continue to work without modifications.

---

## Todo Entity (Extended)

### Core Fields (Unchanged - Phase I)

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|----------|-------------|
| `id` | Integer | PK, autoincrement | Unique identifier |
| `user_id` | Integer | FK → User, NOT NULL | Task owner |
| `title` | String(500) | NOT NULL | Task title |
| `description` | String(5000) | NULL | Extended details |
| `completed` | Boolean | False | Completion status |
| `created_at` | DateTime | UTC NOW | Creation timestamp |
| `updated_at` | DateTime | UTC NOW, onupdate | Last modification |

### Extended Fields (New - Phase II)

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|----------|-------------|
| `priority` | Enum | NULL | MEDIUM | Task priority level |
| `tags` | JSON/ARRAY | NULL | [] | Array of tag strings |
| `due_date` | DateTime | NULL | NULL | Due date and time |
| `recurrence` | Enum | NULL | NONE | Recurrence pattern |

---

## Enumerated Types

### Priority Enum

| Value | Order | Description | Visual Indicator |
|-------|--------|-------------|-----------------|
| `LOW` | 3 | Low importance task | Green badge |
| `MEDIUM` | 2 | Normal priority task | Yellow/gray badge |
| `HIGH` | 1 | Urgent task | Red badge |

**Validation Rules**:
- Must be one of: `LOW`, `MEDIUM`, `HIGH`
- NULL = no priority specified (treated as MEDIUM in UI)
- Sort order: HIGH > MEDIUM > LOW for priority-based sorting
- Database storage: String ("low", "medium", "high") for compatibility

### Recurrence Pattern Enum

| Value | Description | Next Run Calculation |
|-------|-------------|----------------------|
| `NONE` | No recurrence | N/A (default) |
| `DAILY` | Task repeats every day | `current_due_date + 1 day` |
| `WEEKLY` | Task repeats every week | `current_due_date + 7 days` |
| `MONTHLY` | Task repeats every month | `current_due_date + 1 month` |

**Validation Rules**:
- Must be one of: `NONE`, `DAILY`, `WEEKLY`, `MONTHLY`
- NULL = no recurrence specified (treated as NONE)
- Day-of-week preservation: Monday weekly task stays on Monday
- Month overflow handling: February 30th → February 28th/29th (nearest valid date)
- Database storage: String ("none", "daily", "weekly", "monthly") for compatibility

---

## Tag Storage

### SQLite (Development)

```sql
tags COLUMN TEXT DEFAULT '[]'  -- JSON array: ["work", "urgent"]
```

**Query Pattern**:
```python
# Filter by tag (case-sensitive)
.query.filter(Todo.tags.contains('"work"'))

# Extract all unique tags
session.query(func.json_each(Todo.tags)).distinct().all()
```

### PostgreSQL (Production)

```sql
tags COLUMN TEXT[] DEFAULT '{}'  -- Native array: ARRAY['work', 'urgent']
```

**Query Pattern**:
```python
# Filter by tag (case-sensitive)
.query.filter(Todo.tags.contains('work'))

# Extract all unique tags
session.query(func.unnest(Todo.tags).label('tag')).distinct().all()
```

### Tag Validation Rules

- Tags are case-sensitive strings
- Maximum tag length: 50 characters
- Maximum tags per task: 10 (prevent abuse)
- Empty array = no tags
- Duplicate tags on same task: prevent in backend
- Special characters allowed: letters, numbers, spaces, hyphens, underscores

---

## Constraints & Invariants

### Business Logic Constraints

1. **Priority Default**: If `priority` is NULL, UI treats as `MEDIUM` but stores as NULL
2. **Recurrence Dependency**: `recurrence` can only be set if `due_date` is provided
3. **Tag Uniqueness**: No duplicate tags on the same task (backend validation)
4. **Overdue Calculation**: A task is overdue if `completed == False` AND `due_date < NOW`
5. **Recurrence Stop**: Setting `recurrence` to `NONE` stops future instance creation
6. **Recurrence Limit**: Maximum 52 instances (1 year) per recurring task to prevent infinite loops

### Data Integrity Constraints

1. **Foreign Key**: Every task must have valid `user_id`
2. **Title Required**: `title` cannot be empty string
3. **DateTime UTC**: All date/times stored in UTC timezone
4. **JSON Validity**: SQLite `tags` column must contain valid JSON array
5. **Enum Validity**: `priority` and `recurrence` must match enum values

---

## Relationships

### Existing Relationships (Unchanged)

```python
# Todo → User (many-to-one)
user = relationship("User", back_populates="todos")
```

### New Relationships (Phase II)

No new entity-level relationships added. All extended data is self-contained within Todo entity for simplicity and performance.

---

## State Transitions

### Task Completion with Recurrence

**Current State**: Task with `recurrence != NONE` and `completed == False`

**Action**: User completes task (PATCH `/api/v1/todos/{id}/complete`)

**Transition**:
1. Set current task `completed = True`
2. If `recurrence != NONE`:
   - Calculate `next_run` based on recurrence pattern
   - Create new Todo instance with:
     - Same `title`, `description`, `priority`, `tags`
     - `due_date = next_run`
     - `completed = False`
     - `recurrence` = same pattern
     - `user_id = same user
3. Return new task in API response

**Successor State**:
- Original task: completed, no longer in pending list
- New task: pending, due date in future, same recurrence pattern

### Tag Management

**Add Tag**: Append to `tags` array (if not duplicate)
**Remove Tag**: Remove from `tags` array
**Replace All Tags**: Replace `tags` array with new list

---

## Migration Strategy

### Phase I → Phase II Migration

**Migration File**: `alembic/versions/002_add_extended_todo_fields.py`

**upgrade()**:
```python
def upgrade():
    # Add priority column (enum stored as string)
    op.add_column('todos_001_todo', sa.Column('priority', sa.String(10), nullable=True))

    # Add tags column (JSON for SQLite, ARRAY for PostgreSQL)
    op.add_column('todos_001_todo', sa.Column('tags', sa.JSON(), nullable=True, server_default='[]'))

    # Add due_date column
    op.add_column('todos_001_todo', sa.Column('due_date', sa.DateTime(), nullable=True))

    # Add recurrence column (enum stored as string)
    op.add_column('todos_001_todo', sa.Column('recurrence', sa.String(10), nullable=True))
```

**downgrade()**:
```python
def downgrade():
    # Remove columns (data loss acceptable - features were optional)
    op.drop_column('todos_001_todo', 'recurrence')
    op.drop_column('todos_001_todo', 'due_date')
    op.drop_column('todos_001_todo', 'tags')
    op.drop_column('todos_001_todo', 'priority')
```

### Rollback Strategy

If migration fails or causes issues:
1. Downgrade removes new columns (existing todos unaffected)
2. Data in extended fields is lost (acceptable - features were optional)
3. No breaking changes to existing CRUD operations
4. Frontend hides new UI components when backend indicates extended features unavailable

---

## Indexes (Performance Optimization)

### SQLite (Development)

```sql
-- For filtering by status and priority
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos_001_todo(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos_001_todo(priority);

-- For sorting by due date
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos_001_todo(due_date);
```

### PostgreSQL (Production)

```sql
-- For filtering
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos_001_todo USING btree(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos_001_todo USING btree(priority);

-- For sorting
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos_001_todo USING btree(due_date);

-- For text search (title, description)
CREATE INDEX IF NOT EXISTS idx_todos_title_gin ON todos_001_todo USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_todos_description_gin ON todos_001_todo USING gin(to_tsvector('english', description));

-- For tag filtering
CREATE INDEX IF NOT EXISTS idx_todos_tags ON todos_001_todo USING gin(tags);
```

---

## Validation Examples

### Create Task with Extended Fields

**Valid Request**:
```json
{
  "title": "Complete project report",
  "description": "Final report for Q4",
  "priority": "high",
  "tags": ["work", "urgent"],
  "due_date": "2026-01-15T17:00:00Z",
  "recurrence": "weekly"
}
```

**Validation Checks**:
- `title` not empty ✅
- `priority` in ["low", "medium", "high"] ✅
- `tags` contains 1-10 strings ✅
- `due_date` is valid ISO 8601 datetime ✅
- `recurrence` in ["none", "daily", "weekly", "monthly"] ✅
- If `recurrence` != "none", then `due_date` must be provided ✅

**Invalid Request**:
```json
{
  "title": "",
  "priority": "urgent",  // Invalid enum value
  "tags": ["tag1", "tag1"],  // Duplicate
  "recurrence": "weekly"  // Missing required due_date
}
```

**Validation Errors**:
- 400 Bad Request: `title` cannot be empty
- 400 Bad Request: Invalid `priority` value. Must be one of: low, medium, high
- 400 Bad Request: Duplicate tag: "tag1"
- 400 Bad Request: `recurrence` requires `due_date`

---

## Summary

**Backward Compatibility**: ✅
- All new fields are NULL-able with safe defaults
- Existing CRUD operations work without modification
- No existing columns removed or renamed
- Migration adds columns only (downgrade removes them)

**Performance**:
- Indexes on frequently filtered/sorted columns
- PostgreSQL GIN indexes for text search and tags
- SQLite development uses basic indexes (acceptable for scale)

**Extensibility**:
- Future: Add `subtasks` relationship
- Future: Add `attachments` or `comments`
- Future: Extend `recurrence` with custom intervals

**Next**: See [contracts/](contracts/) for API specifications
