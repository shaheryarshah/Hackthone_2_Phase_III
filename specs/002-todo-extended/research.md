# Research: Todo Extended Features

**Feature**: 002-todo-extended
**Date**: 2026-01-02
**Purpose**: Resolve technology decisions and clarify implementation approaches for Phase II extended features

## Decision Summary

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|------------------------|
| Database Schema Evolution | Alembic migrations with SQLite/PostgreSQL compatibility | Flyway (too complex), SQL files (no rollback), ORM auto-migrate (unreliable) |
| Search Implementation | SQLAlchemy `ilike` operator (SQLite) → GIN indexes (PostgreSQL) | Elasticsearch (overkill), MeiliSearch (additional service), PostgreSQL full-text (good for prod but not dev) |
| Tag Storage | JSON array column (SQLite) → native array (PostgreSQL) | Separate tags table (complex joins), Comma-separated string (no filtering) |
| Recurrence Trigger | Immediate post-completion hook (synchronous) | Background processor (Celery - overkill), Scheduled jobs (APScheduler - race conditions) |
| Reminder System | Frontend polling with browser notifications | Server push (complex, needs WebSocket/SignalR), Email (not real-time), In-app only (not proactive) |
| Sort/Filter Strategy | Dynamic SQLAlchemy Query builder | Client-side (violates constitution), Stored procedures (not portable), Microservices (over-engineering) |

---

## 1. Database Schema Evolution

### Decision
Use **Alembic** for database migrations with additive-only schema changes.

### Rationale
- Alembic is SQLAlchemy's standard migration tool (already in backend dependencies)
- Supports both SQLite (development) and PostgreSQL (production)
- Migrations are version-controlled and reversible
- Additive-only changes ensure backward compatibility (constitution requirement)
- No existing columns removed or renamed, protecting existing data

### Implementation Details
**New Fields for `todos_001_todo` table**:
```python
priority = Column(Enum(Priority), nullable=True, default=Priority.MEDIUM)
tags = Column(JSON, nullable=True, default='[]')  # SQLite: JSON; PostgreSQL: ARRAY(String)
due_date = Column(DateTime, nullable=True)
recurrence = Column(Enum(RecurrencePattern), nullable=True, default=RecurrencePattern.NONE)
```

**Migration Approach**:
1. Create new migration file: `alembic revision -m "add_extended_todo_fields"`
2. Define upgrade() to add columns with defaults
3. Define downgrade() to remove columns (preserving data integrity)
4. Test on development SQLite database first
5. Document PostgreSQL-specific notes (JSON vs ARRAY types)

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| SQLAlchemy auto-migrate (`Base.metadata.create_all`) | No rollback capability, no version history, breaks existing data |
| Raw SQL files | Platform-specific, no dependency management, harder to test |
| Flyway (Java migration tool) | Not Python-native, doesn't integrate with SQLAlchemy models |
| No migrations (add columns manually) | No reproducibility across environments, no rollback |

---

## 2. Search Implementation

### Decision
Use **SQLAlchemy's `ilike` operator** for case-insensitive full-text search.

### Rationale
- Native to SQLAlchemy, no additional dependencies
- Works across SQLite and PostgreSQL
- Case-insensitive (`ilike`) improves user experience
- Searches both title and description fields (union or separate queries)

### Implementation Details
**Query Builder Pattern**:
```python
def apply_search_filters(query, search_query):
    if search_query:
        search_term = f"%{search_query}%"
        query = query.filter(
            (Todo.title.ilike(search_term)) |
            (Todo.description.ilike(search_term))
        )
    return query
```

**Performance Considerations**:
- SQLite: `ilike` uses full table scan (acceptable for < 10k tasks)
- PostgreSQL: Add GIN indexes on title and description for production
- Consider `to_tsvector()` for advanced full-text search in PostgreSQL (future enhancement)
- Debounce frontend search input to avoid excessive queries

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| Elasticsearch | Overkill for single-app todo list, adds infrastructure complexity, additional service to maintain |
| MeiliSearch | Lightweight but still requires additional service, not needed for simple text search |
| PostgreSQL `to_tsvector()` | Good for production, but adds complexity for SQLite development, defer to later phase |
| Client-side search | Violates constitution (server-driven filtering), doesn't work with pagination |

---

## 3. Tag Storage Strategy

### Decision
Use **JSON array column in SQLite** with migration to native PostgreSQL arrays in production.

### Rationale
- SQLite has no native array type → JSON is simplest option
- PostgreSQL supports native `ARRAY(String)` type (better performance)
- JSON column works for development; migration handles production optimization
- Allows storing 0+ tags per task (flexible)
- Easy to filter with SQLAlchemy's `.contains()` or JSON operators

### Implementation Details
**SQLite (Development)**:
```python
tags = Column(JSON, nullable=True, default='[]')  # Stores as: '["work", "urgent"]'
```

**PostgreSQL (Production)**:
```python
tags = Column(ARRAY(String), nullable=True, default=[])  # Stores as: ARRAY['work', 'urgent']
```

**Query Patterns**:
```python
# Filter by tag (SQLite JSON):
query.filter(Todo.tags.contains('"work"'))

# Filter by tag (PostgreSQL ARRAY):
query.filter(Todo.tags.contains('work'))

# Get all unique tags for UI:
tags = session.query(func.json_each(Todo.tags)).distinct().all()
```

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| Separate `tags` table with junction table | Over-normalized for simple use case, requires joins, more complex queries |
| Comma-separated string | Cannot filter efficiently, no validation of tag format, prone to parsing errors |
| Embedded document store (MongoDB) | Violates constitution (SQL database), breaks existing architecture |

---

## 4. Recurrence Trigger Logic

### Decision
Use **immediate post-completion hook** (synchronous) to create next task instance.

### Rationale
- Simpler than background processors (no Celery/Redis setup)
- Immediate feedback: user sees next task instantly
- No race conditions with scheduled jobs
- Fits within existing completion endpoint flow
- Easy to test and debug
- Constitution requirement: "recurrence logic handled in backend" ✅

### Implementation Details
**Workflow**:
1. User completes recurring task (PATCH `/api/v1/todos/{id}/complete`)
2. Backend checks `recurrence` field is not "none"
3. Backend calculates `next_run` based on recurrence pattern:
   - Daily: `current_due_date + 1 day`
   - Weekly: `current_due_date + 7 days`
   - Monthly: `current_due_date + 1 month` (handle month overflow)
4. Backend creates new task with same title, description, priority, tags, and recurrence
5. New task's `due_date` = `next_run`
6. Returns new task in response

**Edge Cases Handled**:
- February 30th → adjust to February 28th/29th
- Day-of-week preservation (e.g., Monday weekly task stays on Monday)
- Maximum recurrence instances: limit to 52 (1 year) to prevent infinite loops
- User disables recurrence: stop creating future instances

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| Background task processor (Celery + Redis) | Over-engineering for simple use case, adds infrastructure complexity, requires additional services |
| Scheduled jobs (APScheduler) | Race conditions with user actions, harder to test, requires persistent scheduler process |
| Frontend auto-creation | Violates constitution (business logic in backend), doesn't work across devices |

---

## 5. Reminder System Implementation

### Decision
Use **frontend browser notifications** with polling for tasks due soon.

### Rationale
- No backend infrastructure required (WebSocket, email service)
- Browser notifications are native and user-friendly
- Frontend polls every 30-60 seconds for tasks with `due_date` in next hour
- Constitution: "reminder triggers before due time" ✅
- Graceful degradation: works even if notifications blocked

### Implementation Details
**Frontend Hook Pattern**:
```typescript
export function useReminders() {
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default')
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Request permission on first load
    if (permission === 'default') {
      Notification.requestPermission().then(setPermission)
    }

    // Start polling if granted and user is logged in
    if (permission === 'granted' && user) {
      const interval = setInterval(async () => {
        const dueSoonTasks = await api.getTodos({
          due_after: new Date(),
          due_before: new Date(Date.now() + 3600000), // 1 hour
          status: 'pending'
        })

        dueSoonTasks.forEach(task => {
          const timeUntilDue = new Date(task.due_date).getTime() - Date.now()
          if (timeUntilDue > 0 && timeUntilDue <= 1800000) { // 30 min
            new Notification(`Task Due Soon: ${task.title}`, {
              body: `Due at ${new Date(task.due_date).toLocaleTimeString()}`,
              tag: `todo-${task.id}`
            })
          }
        })
      }, 30000) // Poll every 30 seconds

      setPollingInterval(interval)

      return () => clearInterval(interval)
    }
  }, [permission, user])

  return { permission, setPermission }
}
```

**Polling Strategy**:
- Poll interval: 30 seconds (balance: battery drain vs. timely notifications)
- Time window: Check tasks due in next 1 hour
- Notification trigger: 30 minutes before due time
- Deduplication: Track notified task IDs in session storage to avoid duplicate alerts

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| Server push (WebSocket/SignalR) | Complex, requires persistent connections, infrastructure overhead, not needed for simple polling |
| Email reminders | Not real-time, requires email service, spam potential, user prefers in-app |
| Server-side polling with push | Frontend polling is simpler, no backend changes needed for notification delivery |
| In-app notifications only | Doesn't alert users when app is closed, less proactive than browser notifications |

---

## 6. Filter & Sort Strategy

### Decision
Use **dynamic SQLAlchemy Query builder** with server-side filtering and sorting.

### Rationale
- Constitution: "filters and sorting must be server-driven" ✅
- Consistent behavior across devices and browsers
- Enables pagination for large result sets
- SQLAlchemy Query API is clean and expressive
- Easy to test and debug

### Implementation Details
**Query Builder Pattern**:
```python
def build_todos_query(user_id, filters):
    query = session.query(Todo).filter(Todo.user_id == user_id)

    # Apply status filter
    if filters.get('status'):
        query = query.filter(Todo.completed == (filters['status'] == 'completed'))

    # Apply priority filter
    if filters.get('priority'):
        query = query.filter(Todo.priority == Priority[filters['priority'].upper()])

    # Apply due date range filter
    if filters.get('due_before'):
        query = query.filter(Todo.due_date <= filters['due_before'])
    if filters.get('due_after'):
        query = query.filter(Todo.due_date >= filters['due_after'])

    # Apply tag filter
    if filters.get('tag'):
        # SQLite JSON: .contains('"tag_name"')
        # PostgreSQL ARRAY: .contains('tag_name')
        query = query.filter(Todo.tags.contains(filters['tag']))

    # Apply search
    if filters.get('search'):
        query = apply_search_filters(query, filters['search'])

    # Apply sorting
    sort_by = filters.get('sort_by', 'created_at')
    sort_order = filters.get('sort_order', 'desc')

    if sort_by == 'due_date':
        query = query.order_by(
            Todo.due_date.asc() if sort_order == 'asc' else Todo.due_date.desc()
        )
    elif sort_by == 'priority':
        # Custom order: HIGH > MEDIUM > LOW
        priority_order = case(
            (Todo.priority == Priority.HIGH, 1),
            (Todo.priority == Priority.MEDIUM, 2),
            (Todo.priority == Priority.LOW, 3),
            else_=4
        )
        query = query.order_by(
            priority_order.asc() if sort_order == 'asc' else priority_order.desc(),
            Todo.created_at.desc()  # Secondary sort
        )
    elif sort_by == 'title':
        query = query.order_by(
            Todo.title.asc() if sort_order == 'asc' else Todo.title.desc()
        )
    else:  # Default: created_at
        query = query.order_by(
            Todo.created_at.asc() if sort_order == 'asc' else Todo.created_at.desc()
        )

    return query
```

**API Query Parameters**:
- `search`: string - keyword search in title/description
- `status`: "completed" | "pending"
- `priority`: "low" | "medium" | "high"
- `due_before`: ISO datetime - filter tasks due before date
- `due_after`: ISO datetime - filter tasks due after date
- `tag`: string - filter by specific tag
- `sort_by`: "created_at" | "due_date" | "priority" | "title"
- `sort_order`: "asc" | "desc"

### Alternatives Considered & Rejected
| Alternative | Why Rejected |
|------------|--------------|
| Client-side filtering | Violates constitution (server-driven required), pagination issues, inconsistent across devices |
| Stored procedures | Not portable across databases, harder to test, versioning complexity |
| Microservices for filtering | Over-engineering, adds network latency, violates simple architecture |
| Separate search endpoint | Redundant, GET /todos with query parameters is RESTful |

---

## Summary

All technology decisions align with:
- **Constitution requirements**: Backward compatibility, server-driven filtering/sorting, backend business logic
- **Existing architecture**: Separation of concerns, API-first, Clean Architecture
- **Performance goals**: <200ms p95 for filtered lists, <2s search for 1000+ tasks
- **Simplicity principle**: No additional infrastructure (Celery, Redis, Elasticsearch) unless needed

**Next**: Proceed to Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)
