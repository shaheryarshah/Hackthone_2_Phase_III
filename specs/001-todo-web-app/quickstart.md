# Quickstart: Todo Full-Stack Application (Phase II)

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- Neon PostgreSQL account (for production database)

## Setup

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repo-url>
cd Phase_II

# Switch to feature branch
git checkout 001-todo-web-app
```

### 2. Backend Setup (FastAPI + SQLModel)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env  # Create .env from template
# Edit .env and set:
#   DATABASE_URL=postgresql://user:password@host/database
#   JWT_SECRET_KEY=your-secret-key-here
#   JWT_ALGORITHM=HS256
#   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Initialize database (run migrations)
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation at `http://localhost:8000/docs`

### 3. Frontend Setup (Next.js + Better Auth)

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local  # Create .env.local from template
# Edit .env.local and set:
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
#   BETTER_AUTH_URL=http://localhost:3000
#   BETTER_AUTH_SECRET=your-auth-secret

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Development Workflow

### Backend

```
backend/
├── src/
│   ├── models/           # SQLModel entities (user.py, todo.py)
│   ├── schemas/          # Pydantic schemas (user.py, todo.py, auth.py)
│   ├── api/
│   │   └── routes/       # API endpoints (auth.py, todos.py)
│   ├── services/         # Business logic (auth_service.py, todo_service.py)
│   ├── middleware/       # JWT verification (auth.py)
│   ├── dependencies.py   # FastAPI dependencies (get_current_user)
│   └── database.py       # DB connection
├── alembic/              # Database migrations
└── tests/
```

### Frontend

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Login/Register pages
│   │   └── (dashboard)/  # Protected todo pages
│   ├── components/       # React components
│   │   ├── auth/         # Auth forms (LoginForm, RegisterForm)
│   │   └── todos/        # Todo components (TodoList, TodoItem, TodoForm)
│   ├── lib/
│   │   ├── auth.ts       # Better Auth configuration
│   │   └── api.ts        # API client with JWT attachment
│   └── hooks/            # Custom hooks (useAuth)
└── tests/
```

## Environment Variables

### Backend (.env)

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx.region.neon.tech/database?sslmode=require

# JWT Authentication
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# API
API_V1_PREFIX=/api/v1
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-auth-secret-min-32-chars
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Validating the Setup

1. Backend running at `http://localhost:8000`
2. Frontend running at `http://localhost:3000`
3. API docs at `http://localhost:8000/docs`
4. Register a new user via the UI or API
5. Login and verify JWT token is received
6. Create a todo via the API or UI
7. Verify the todo appears only for that user
8. Test update and delete operations
9. Attempt to access another user's todo (should return 403)

## Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change port with `uvicorn main:app --port 8001` |
| Database connection failed | Verify DATABASE_URL in .env; check Neon firewall settings |
| CORS errors | Configure CORS origins in FastAPI middleware |
| JWT verification failed | Ensure JWT_SECRET_KEY matches between backend and frontend |
| Module not found | Reinstall dependencies with `pip install -r requirements.txt` |
| bcrypt hash error | Install bcrypt: `pip install bcrypt` |

## Next Steps

After setup, run `/sp.tasks` to generate the implementation task list for Phase II.
