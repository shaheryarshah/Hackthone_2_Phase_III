/** API service for Todo application. */

import axios from 'axios';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoListResponse,
  TodoFilters,
  TodoSort,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const todoApi = {
  // Get all todos with optional filters and sorting
  async getTodos(filters?: TodoFilters, sort?: TodoSort): Promise<Todo[]> {
    const params: Record<string, string> = {};

    if (filters?.search) {
      params.search = filters.search;
    }
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    if (filters?.due_before) {
      params.due_before = new Date(filters.due_before).toISOString();
    }
    if (filters?.due_after) {
      params.due_after = new Date(filters.due_after).toISOString();
    }
    if (filters?.tag) {
      params.tag = filters.tag;
    }
    if (sort?.sortBy) {
      params.sort_by = sort.sortBy;
    }
    if (sort?.sortOrder) {
      params.sort_order = sort.sortOrder;
    }

    const response = await api.get<TodoListResponse>('/todos', { params });
    return response.data.todos;
  },

  // Create a new todo
  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  // Get a single todo by ID
  async getTodo(id: number): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Update a todo
  async updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  // Delete a todo
  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  // Mark a todo as complete
  async markTodoComplete(id: number): Promise<{ completed_task: Todo; next_task?: Todo }> {
    const response = await api.patch(`/todos/${id}/complete`);
    return response.data;
  },

  // Get todos due soon (for reminders)
  async getTodosDueSoon(hours: number = 1): Promise<Todo[]> {
    const response = await api.get<{ todos: Todo[] }>('/todos/due-soon', {
      params: { hours },
    });
    return response.data.todos;
  },
};

export default todoApi;
