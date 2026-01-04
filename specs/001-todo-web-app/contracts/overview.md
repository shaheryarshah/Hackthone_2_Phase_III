# API Contracts: Todo Full-Stack Application (Phase II)

## Overview

REST API for managing todo items with JWT-based authentication. All endpoints return JSON responses. Todo endpoints require valid JWT token in `Authorization: Bearer <token>` header.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All protected endpoints require:

```http
Authorization: Bearer <jwt_token>
```

### Error Response (Common)

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
```

---

## Authentication Endpoints (Public - No Token Required)

### POST /auth/register

Create a new user account.

**Request**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created)**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-12-31T10:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 400 | VALIDATION_ERROR | Invalid email format |
| 400 | VALIDATION_ERROR | Password must be at least 8 characters |
| 409 | EMAIL_EXISTS | Email already registered |

---

### POST /auth/login

Authenticate and receive JWT token.

**Request**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK)**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-12-31T10:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 401 | INVALID_CREDENTIALS | Invalid email or password |
| 422 | VALIDATION_ERROR | Invalid input format |

---

## Todo Endpoints (Protected - Require JWT)

### GET /todos

Fetch all todos for the authenticated user.

**Request**

```http
GET /todos
Authorization: Bearer <token>
```

**Success Response (200 OK)**

```json
{
  "todos": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-31T10:00:00Z",
      "updated_at": "2025-12-31T10:00:00Z"
    }
  ]
}
```

---

### POST /todos

Create a new todo.

**Request**

```http
POST /todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Success Response (201 Created)**

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-31T10:00:00Z",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 400 | VALIDATION_ERROR | Title is required |
| 401 | UNAUTHORIZED | Invalid or missing token |

---

### GET /todos/{id}

Fetch a single todo by ID (only if owned by authenticated user).

**Request**

```http
GET /todos/1
Authorization: Bearer <token>
```

**Success Response (200 OK)**

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-31T10:00:00Z",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | You do not have access to this todo |
| 404 | NOT_FOUND | Todo with id=1 not found |

---

### PUT /todos/{id}

Update an existing todo (only if owned by authenticated user).

**Request**

```http
PUT /todos/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries and household items",
  "description": "Milk, eggs, bread, soap"
}
```

**Success Response (200 OK)**

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Buy groceries and household items",
  "description": "Milk, eggs, bread, soap",
  "completed": false,
  "created_at": "2025-12-31T10:00:00Z",
  "updated_at": "2025-12-31T11:00:00Z"
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | You do not have access to this todo |
| 404 | NOT_FOUND | Todo with id=1 not found |

---

### DELETE /todos/{id}

Delete a todo (only if owned by authenticated user).

**Request**

```http
DELETE /todos/1
Authorization: Bearer <token>
```

**Success Response (204 No Content)**

```
(empty body)
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | You do not have access to this todo |
| 404 | NOT_FOUND | Todo with id=1 not found |

---

### PATCH /todos/{id}/complete

Mark a todo as complete (only if owned by authenticated user).

**Request**

```http
PATCH /todos/1/complete
Authorization: Bearer <token>
```

**Success Response (200 OK)**

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-31T10:00:00Z",
  "updated_at": "2025-12-31T11:00:00Z"
}
```

**Error Responses**

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | You do not have access to this todo |
| 404 | NOT_FOUND | Todo with id=1 not found |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (new resource) |
| 204 | No Content (successful deletion) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (accessing another user's resource) |
| 404 | Not Found (resource doesn't exist) |
| 409 | Conflict (email already exists) |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |

---

## OpenAPI Schema

See `contracts/openapi.yaml` for complete OpenAPI 3.0 specification with authentication.
