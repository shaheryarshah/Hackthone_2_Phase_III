# Quickstart Guide: Todo Extended Features

**Feature**: 002-todo-extended
**Date**: 2026-01-02
**Purpose**: Step-by-step guide for developers to set up and test Phase II extended features

---

## Prerequisites

- ✅ Phase I (basic todo CRUD) is working
- ✅ Backend server running on port 8000
- ✅ Frontend dev server running on port 3000
- ✅ Database initialized with existing todos
- ✅ User can authenticate and create/update/delete tasks

---

## Step 1: Database Migration Setup

### 1.1 Create Migration File

```bash
cd backend
alembic revision -m "add_extended_todo_fields"
```

This creates: `backend/alembic/versions/002_add_extended_todo_fields.py`

### 1.2 Write Migration

Edit the migration file:

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Add priority column (enum stored as string)
    op.add_column('todos_001_todo', sa.Column('priority', sa.String(10), nullable=True))

    # Add tags column (JSON for SQLite, ARRAY for PostgreSQL)
    op.add_column('todos_001_todo', sa.Column('tags', sa.JSON(), nullable=True, server_default='[]'))

    # Add due_date column
    op.add_column('todos_001_todo', sa.Column('due_date', sa.DateTime(), nullable=True))

    # Add recurrence column (enum stored as string)
    op.add_column('todos_001_todo', sa.Column('recurrence', sa.String(10), nullable=True))

def downgrade():
    # Remove columns (data loss acceptable - features were optional)
    op.drop_column('todos_001_todo', 'recurrence')
    op.drop_column('todos_001_todo', 'due_date')
    op.drop_column('todos_001_todo', 'tags')
    op.drop_column('todos_001_todo', 'priority')
```

### 1.3 Apply Migration

```bash
cd backend
alembic upgrade head
```

**Expected Output**:
```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade 002_add_extended_todo_fields -> head
INFO  [alembic.runtime.migration] done
```

### 1.4 Verify Schema

Check database has new columns:

```bash
sqlite3 backend/todos.db ".schema todos_001_todo"
```

**Expected Output**:
```sql
CREATE TABLE todos_001_todo (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(5000),
    completed BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    priority VARCHAR(10),
    tags JSON,
    due_date DATETIME,
    recurrence VARCHAR(10),
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users_001_todo (id)
);
```

### 1.5 Backward Compatibility Check

Verify existing tasks still work:

```bash
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Existing tasks return successfully (priority, tags, etc. as `null`)

---

## Step 2: Backend Endpoint Testing

### 2.1 Create Task with All Extended Fields

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Complete project report",
    "description": "Final Q4 report with financial analysis",
    "priority": "high",
    "tags": ["work", "urgent", "q4"],
    "due_date": "2026-01-15T17:00:00Z",
    "recurrence": "weekly"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": 42,
  "user_id": 1,
  "title": "Complete project report",
  "description": "Final Q4 report with financial analysis",
  "completed": false,
  "priority": "high",
  "tags": ["work", "urgent", "q4"],
  "due_date": "2026-01-15T17:00:00Z",
  "recurrence": "weekly",
  "created_at": "2026-01-02T12:34:56Z",
  "updated_at": "2026-01-02T12:34:56Z"
}
```

### 2.2 Test Filtering by Priority

```bash
curl -X GET "http://localhost:8000/api/v1/todos?priority=high&status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Only high-priority, pending tasks returned

### 2.3 Test Search

```bash
curl -X GET "http://localhost:8000/api/v1/todos?search=report" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Tasks with "report" in title or description

### 2.4 Test Filtering by Due Date Range

```bash
curl -X GET "http://localhost:8000/api/v1/todos?due_after=2026-01-01T00:00:00Z&due_before=2026-01-31T23:59:59Z" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Tasks due in January 2026

### 2.5 Test Filtering by Tag

```bash
curl -X GET "http://localhost:8000/api/v1/todos?tag=work" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Tasks with "work" tag

### 2.6 Test Sorting

```bash
curl -X GET "http://localhost:8000/api/v1/todos?sort_by=due_date&sort_order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Tasks sorted by due date (earliest first)

### 2.7 Test Combining Filters and Sort

```bash
curl -X GET "http://localhost:8000/api/v1/todos?search=meeting&priority=high&status=pending&sort_by=due_date" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: High-priority, pending tasks with "meeting" in title/description, sorted by due date

### 2.8 Test Empty Filter Results

```bash
curl -X GET "http://localhost:8000/api/v1/todos?search=nonexistentterm" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected** (200 OK):
```json
{
  "todos": [],
  "count": 0,
  "has_more": false,
  "message": "No tasks match your current filters. Try adjusting your search or filters."
}
```

### 2.9 Test Update Task

```bash
curl -X PUT http://localhost:8000/api/v1/todos/42 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "priority": "medium",
    "tags": ["work"]
  }'
```

**Expected**: Task 42 priority updated to "medium", tags updated to `["work"]`

### 2.10 Test Recurring Task Completion

```bash
# First, create a recurring task
TASK_ID=$(curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Weekly standup",
    "recurrence": "weekly",
    "due_date": "2026-01-08T10:00:00Z",
    "priority": "medium"
  }' | jq -r '.id')

# Complete the task
curl -X PATCH http://localhost:8000/api/v1/todos/$TASK_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Returns both `completed_task` and `next_task` with due date 1 week later

---

## Step 3: Frontend Component Integration

### 3.1 Add Priority Dropdown to TodoForm

Edit `frontend/src/components/TodoForm.tsx`:

```typescript
// Add priority field to form state
const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

// Add to form JSX
<select
  value={priority}
  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
  className="border rounded px-3 py-2"
>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</select>
```

### 3.2 Add Tag Input to TodoForm

```typescript
// Add tags field to form state
const [tags, setTags] = useState<string[]>([])

// Add to form JSX
<input
  type="text"
  value={tags.join(', ')}
  onChange={(e) => setTags(e.target.value.split(', ').filter(t => t.trim()))}
  placeholder="work, urgent, q4"
  className="border rounded px-3 py-2"
/>
```

### 3.3 Add Due Date Picker to TodoForm

```typescript
// Add due_date field to form state
const [dueDate, setDueDate] = useState<string>('')

// Add to form JSX
<input
  type="datetime-local"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
  className="border rounded px-3 py-2"
/>
```

### 3.4 Add Recurrence Selector to TodoForm

```typescript
// Add recurrence field to form state
const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none')

// Add to form JSX
<select
  value={recurrence}
  onChange={(e) => setRecurrence(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly')}
  className="border rounded px-3 py-2"
>
  <option value="none">No recurrence</option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
</select>
```

### 3.5 Update API Call to Include Extended Fields

Edit `frontend/src/services/api.ts`:

```typescript
export async function createTodo(todo: TodoCreateRequest): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      title: todo.title,
      description: todo.description,
      priority: todo.priority || undefined,  // Optional
      tags: todo.tags || [],               // Optional
      due_date: todo.due_date || undefined,  // Optional
      recurrence: todo.recurrence || undefined,  // Optional
    }),
  })

  return response.json()
}
```

### 3.6 Update TodoList to Pass Query Parameters

```typescript
export async function listTodos(filters: TodoFilters): Promise<Todo[]> {
  const params = new URLSearchParams()

  if (filters.search) params.append('search', filters.search)
  if (filters.status) params.append('status', filters.status)
  if (filters.priority) params.append('priority', filters.priority)
  if (filters.due_before) params.append('due_before', filters.due_before)
  if (filters.due_after) params.append('due_after', filters.due_after)
  if (filters.tag) params.append('tag', filters.tag)
  if (filters.sort_by) params.append('sort_by', filters.sort_by)
  if (filters.sort_order) params.append('sort_order', filters.sort_order)

  const response = await fetch(`${API_URL}/todos?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  })

  return response.json().todos
}
```

---

## Step 4: Testing Search/Filter/Sort Combinations

### 4.1 Test All Filter Types

| Test | URL | Expected |
|------|-----|----------|
| Search keyword | `?search=meeting` | Tasks with "meeting" in title/description |
| Status pending | `?status=pending` | Only active tasks |
| Priority high | `?priority=high` | Only high-priority tasks |
| Due before date | `?due_before=2026-01-15T23:59:59Z` | Tasks due before date |
| Due after date | `?due_after=2026-01-01T00:00:00Z` | Tasks due after date |
| Tag filter | `?tag=work` | Tasks with "work" tag |
| Sort by due date | `?sort_by=due_date&sort_order=asc` | Earliest due date first |
| Sort by priority | `?sort_by=priority&sort_order=desc` | High → Medium → Low |

### 4.2 Test Filter Combinations

**Test 1**: High priority + pending + sort by due date
```
GET /api/v1/todos?priority=high&status=pending&sort_by=due_date
```
**Expected**: Only pending, high-priority tasks, sorted by due date (earliest first)

**Test 2**: Search + tag + status
```
GET /api/v1/todos?search=project&tag=work&status=pending
```
**Expected**: Pending tasks with "project" in title/description AND "work" tag

**Test 3**: Date range + priority
```
GET /api/v1/todos?due_after=2026-01-01&due_before=2026-01-31&priority=high
```
**Expected**: High-priority tasks due in January 2026

### 4.3 Test Empty Results

**Test**: Search for non-existent term
```
GET /api/v1/todos?search=nonexistentxyz123
```
**Expected**: Empty array with helpful message

---

## Step 5: Recurring Task Workflow Demonstration

### 5.1 Create Daily Recurring Task

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Morning standup",
    "description": "15-minute team sync",
    "recurrence": "daily",
    "due_date": "2026-01-03T09:00:00Z",
    "priority": "medium"
  }' | jq
```

### 5.2 Complete Daily Task

```bash
# Get task ID from previous response
TASK_ID=<id from above>

curl -X PATCH http://localhost:8000/api/v1/todos/$TASK_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

**Expected**: Returns `completed_task` (today) and `next_task` (tomorrow)

### 5.3 Verify Next Task in List

```bash
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.todos[] | select(.id == <next_task.id>)'
```

**Expected**: Next task appears in list with correct due date

### 5.4 Test Weekly Recurrence

Create task with `recurrence: "weekly"`, complete it, verify next task is +7 days

### 5.5 Test Monthly Recurrence

Create task with `recurrence: "monthly"`, complete it, verify next task is +1 month

### 5.6 Test Stopping Recurrence

Update task to set `recurrence: "none"`, complete it, verify NO next task created

---

## Step 6: Reminder Permission and Testing

### 6.1 Grant Browser Notification Permission

Open browser console and run:

```javascript
Notification.requestPermission().then(permission => {
  console.log('Notification permission:', permission)
})
```

**Expected**: Browser prompts user to allow notifications, returns `"granted"` or `"denied"`

### 6.2 Test Reminder Trigger

1. Create a task due in 30 minutes:
   ```bash
   curl -X POST http://localhost:8000/api/v1/todos \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "Urgent task",
       "due_date": "2026-01-02T12:34:00Z"
     }'
   ```

2. Wait 30 minutes (or adjust due date to trigger sooner)
3. Verify browser notification appears

**Expected Notification**:
- Title: "Task Due Soon: Urgent task"
- Body: "Due at 12:34 PM"
- Clickable: Links to task

### 6.3 Test Multiple Due Tasks

Create 3 tasks due soon, verify 3 separate notifications

### 6.4 Test Permission Denied

1. Block notifications in browser settings
2. Create task due soon
3. Verify no notification appears (graceful degradation)

---

## Troubleshooting

### Migration Fails

**Error**: `sqlite3.OperationalError: no such table: alembic_version`

**Fix**:
```bash
alembic stamp head
```

### Filters Not Working

**Symptom**: Filters return all tasks

**Fix**:
- Verify database columns were created
- Check backend logs for SQL query errors
- Verify query parameter names match (case-sensitive)

### Recurrence Not Creating Next Task

**Symptom**: Completing recurring task doesn't create new instance

**Fix**:
- Check `due_date` is set on original task
- Verify `recurrence` field is valid (`daily`, `weekly`, `monthly`)
- Check backend logs for recurrence calculation errors
- Verify backend is using PATCH endpoint, not PUT

### Notifications Not Appearing

**Symptom**: Tasks due but no browser notification

**Fix**:
- Verify browser granted notification permission
- Check frontend console for polling errors
- Verify `useReminders` hook is called in app
- Check `due_date` is in UTC timezone
- Verify polling interval is running (30 seconds)

---

## Validation Checklist

### Backend Tests

- [ ] Migration applies successfully
- [ ] Existing todos still work (backward compatibility)
- [ ] Create task with all extended fields
- [ ] Create task with only priority
- [ ] Create task with only tags
- [ ] Create task with only due date
- [ ] Create task with only recurrence
- [ ] Search returns matching tasks
- [ ] Filter by status works
- [ ] Filter by priority works
- [ ] Filter by due date range works
- [ ] Filter by tag works
- [ ] Combine filters (AND logic)
- [ ] Sort by due date works
- [ ] Sort by priority works
- [ ] Sort by title works
- [ ] Empty results show helpful message
- [ ] Update task extended fields
- [ ] Complete recurring task creates next instance
- [ ] Daily recurrence +1 day
- [ ] Weekly recurrence +7 days
- [ ] Monthly recurrence +1 month
- [ ] Stop recurrence works

### Frontend Tests

- [ ] Priority dropdown appears in form
- [ ] Tag input accepts comma-separated values
- [ ] Due date picker appears and works
- [ ] Recurrence selector appears and works
- [ ] Form submission includes all extended fields
- [ ] API calls include query parameters for filtering
- [ ] API calls include sort parameters
- [ ] Filter bar shows all filter controls
- [ ] Sort controls show all sort options
- [ ] Empty results display helpful message
- [ ] Priority badge displays correctly (green/yellow/red)
- [ ] Tag chips display correctly
- [ ] Overdue indicator shows (red badge)
- [ ] Reminders request permission
- [ ] Reminders trigger correctly
- [ ] Reminders show task title and due time

---

## Next Steps

After completing this quickstart guide:

1. ✅ All extended features are working end-to-end
2. ✅ Backward compatibility verified (existing tasks work)
3. ✅ All API contracts tested
4. ✅ Frontend components integrated
5. ✅ Recurrence logic verified
6. ✅ Reminder system verified

**Proceed to**: Full implementation and testing per [tasks.md](../tasks.md) (generated by `/sp.tasks`)
