/** TypeScript types for Todo application API responses. */

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  due_date?: string; // ISO 8601 datetime
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  overdue?: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  due_date?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  due_date?: string | null;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface TodoListResponse {
  todos: Todo[];
}

// ============================================
// Authentication Types
// ============================================

export interface User {
  id: number;
  email: string;
  created_at: string; // ISO 8601 datetime
}

export interface UserCreate {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: UserResponse;
  access_token: string;
  token_type: string;
}

export interface AuthError {
  detail: string;
}

// ============================================
// Auth Session State
// ============================================

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// ============================================
// Filter & Sort Types
// ============================================

export interface TodoFilters {
  search?: string;
  status?: 'completed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  due_before?: string;
  due_after?: string;
  tag?: string;
}

export interface TodoSort {
  sortBy?: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoListResponse {
  todos: Todo[];
  count: number;
  has_more?: boolean;
}

