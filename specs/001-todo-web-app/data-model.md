# Data Model: Todo Full-Stack Application (Phase II)

**Feature**: 001-todo-web-app | **Date**: 2025-12-31
**Phase**: II - Multi-User Authentication & Persistence
**Based On**: Feature specification from [spec.md](spec.md)

## Entities

### User Entity

Represents a registered user account in the system.

```python
# SQLModel definition (backend/src/models/user.py)
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    """Registered user with authentication credentials."""
    __tablename__ = "users_001_todo"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to todos
    todos: list["Todo"] = Relationship(back_populates="user")
```

**Field Descriptions**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | PK, auto-increment | Unique identifier |
| email | str | unique, max 255 | User's email address (login identifier) |
| password_hash | str | max 255 | bcrypt hash of user's password |
| created_at | datetime | auto-set | When account was created |
| updated_at | datetime | auto-set-on-update | Last account modification |

---

### Todo Entity

Represents a task item owned by a specific user.

```python
# SQLModel definition (backend/src/models/todo.py)
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Todo(SQLModel, table=True):
    """Task item belonging to a user."""
    __tablename__ = "todos_001_todo"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users_001_todo.id", ondelete="CASCADE")
    title: str = Field(max_length=500)
    description: str | None = Field(default=None, max_length=5000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="todos")
```

**Field Descriptions**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | PK, auto-increment | Unique identifier |
| user_id | int | FK → users.id, CASCADE delete | Owner of the todo |
| title | str | max 500 | Short task description (required) |
| description | str | max 5000, optional | Detailed task information |
| completed | bool | default false | Completion status |
| created_at | datetime | auto-set | When todo was created |
| updated_at | datetime | auto-set-on-update | Last modification |

---

## Relationships

```
User (1) ──────< (many) Todo

Each User can have many Todos
Each Todo belongs to exactly one User
```

**Foreign Key Constraint**: `todos.user_id → users.id` with `ON DELETE CASCADE`

When a user is deleted, all their todos are automatically deleted.

---

## Pydantic Schemas

### User Schemas (backend/src/schemas/user.py)

```python
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    """Registration request."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=128, description="Password (8+ chars)")

class UserLogin(BaseModel):
    """Login request."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class UserResponse(BaseModel):
    """User data returned from API (no password)."""
    id: int
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserWithToken(UserResponse):
    """User response with JWT token."""
    access_token: str
    token_type: str = "bearer"
```

### Todo Schemas (backend/src/schemas/todo.py)

```python
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class TodoCreate(BaseModel):
    """Create todo request."""
    title: str = Field(..., min_length=1, max_length=500, description="Task title (required)")
    description: str | None = Field(None, max_length=5000, description="Optional details")

class TodoUpdate(BaseModel):
    """Update todo request (all fields optional)."""
    title: str | None = Field(None, min_length=1, max_length=500)
    description: str | None = Field(None, max_length=5000)
    completed: bool | None = None

class TodoResponse(BaseModel):
    """Todo data returned from API."""
    id: int
    user_id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### Auth Schemas (backend/src/schemas/auth.py)

```python
class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds until expiration

class ErrorResponse(BaseModel):
    """API error response."""
    detail: str
```

---

## Database Schema (SQL)

```sql
-- Users table
CREATE TABLE users_001_todo (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_users_001_todo_email ON users_001_todo(email);

-- Todos table with foreign key to users
CREATE TABLE todos_001_todo (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users_001_todo(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(5000),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_todos_001_todo_user_id ON todos_001_todo(user_id);
CREATE INDEX ix_todos_001_todo_user_id_id ON todos_001_todo(user_id, id);
```

---

## Validation Rules

### Email Validation
- Must be valid email format (RFC 5322)
- Must be unique across all users
- Maximum 255 characters

### Password Validation
- Minimum 8 characters
- Maximum 128 characters
- Stored as bcrypt hash (work factor: 12)

### Title Validation
- Minimum 1 character (non-empty)
- Maximum 500 characters

### Description Validation
- Optional (can be null/empty)
- Maximum 5000 characters if provided

---

## State Transitions

### Todo State Machine

```
[Created] --(mark complete)--> [Completed]
[Completed] --(unmark)-------> [Active]
[Created/Completed] --(update)--> [Same state, updated content]
[Any] --(delete)------------> [Deleted]
```

---

## API Layer Notes

- All todo queries MUST filter by `user_id` from JWT token
- User can only modify todos where `todo.user_id == current_user.id`
- 403 response when attempting to access another user's resource
- 401 response when JWT token is missing or invalid
