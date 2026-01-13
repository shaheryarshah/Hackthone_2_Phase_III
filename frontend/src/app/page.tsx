'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import SortControls from '@/components/SortControls';
import type { Todo, User, TodoFilters, TodoSort } from '@/types';
import Link from 'next/link';
import FloatingChatButton from '@/components/FloatingChatButton';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useState(true);
  const hasLoadedOnce = useRef(false);
  const userRef = useRef<User | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sort, setSort] = useState<TodoSort>({ sortBy: 'created_at', sortOrder: 'desc' });
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs to access current values without causing re-renders
  const filtersRef = useRef<TodoFilters>(filters);
  const sortRef = useRef<TodoSort>(sort);
  const isFetchingRef = useRef<boolean>(false); // Initialize with false consistently

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  // Update isFetching ref without creating dependency cycle
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }); // Removed [isFetching] dependency to prevent potential infinite loop

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);

  // Extract unique tags from todos
  const availableTags = Array.from(
    new Set(
      todos.flatMap(todo => todo.tags || []).filter(tag => tag.length > 0)
    )
  );

  const fetchTodos = useCallback(async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      return;
    }

    // Set appropriate loading state
    if (hasLoadedOnce.current) {
      // For subsequent fetches, use isFetching to avoid UI flickering
      setIsFetching(true);
    } else {
      // For initial load, keep the main loading state
      setLoading(true);
    }

    try {
      const headers = getAuthHeaders() as HeadersInit;

      // Use ref values to avoid dependency issues
      const currentFilters = filtersRef.current;
      const currentSort = sortRef.current;

      // Build query parameters
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.priority) params.append('priority', currentFilters.priority);
      if (currentFilters.due_before) params.append('due_before', new Date(currentFilters.due_before).toISOString());
      if (currentFilters.due_after) params.append('due_after', new Date(currentFilters.due_after).toISOString());
      if (currentFilters.tag) params.append('tag', currentFilters.tag);
      if (currentSort.sortBy) params.append('sort_by', currentSort.sortBy);
      if (currentSort.sortOrder) params.append('sort_order', currentSort.sortOrder);

      const queryString = params.toString();
      const fullUrl = `${apiUrl}/todos?${queryString}`;

      const response = await fetch(fullUrl, { headers });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please login to view todos');
          return;
        }
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data.todos || []);

      // Mark that we've loaded at least once
      if (!hasLoadedOnce.current) {
        hasLoadedOnce.current = true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsFetching(false);
      // Only set main loading to false after initial load
      if (hasLoadedOnce.current) {
        setLoading(false);
      }
    }
  }, [apiUrl, getAuthHeaders]);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        userRef.current = parsedUser; // Store the user in ref to have a stable reference
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch todos on initial load when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]); // Only run when user state changes

  // Debounced function to prevent excessive API calls
  const debouncedFetchTodos = useCallback(() => {
    // Clear the previous timeout if it exists
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Set a new timeout
    fetchTimeoutRef.current = setTimeout(() => {
      if (!isFetchingRef.current && shouldAutoRefresh) {
        fetchTodos();
      }
    }, 500); // Increase debounce time to 500ms for better performance
  }, [fetchTodos, shouldAutoRefresh]);

  // Fetch todos when filters or sort changes (but only if user is authenticated and auto-refresh is enabled)
  useEffect(() => {
    if (user && shouldAutoRefresh) {
      debouncedFetchTodos();
    }
  }, [filters, sort, user, shouldAutoRefresh, debouncedFetchTodos]); // Run when filters or sort change

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    userRef.current = null; // Update the ref as well
    setTodos([]);
    setError('Please login to continue');
  }, []);

  const handleTodoCreated = useCallback((todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  }, []);

  const handleTodoUpdate = useCallback(() => {
    // Temporarily disable auto-refresh to prevent infinite loops
    setShouldAutoRefresh(false);
    debouncedFetchTodos();
    // Re-enable auto-refresh after a delay
    setTimeout(() => setShouldAutoRefresh(true), 500);
  }, [debouncedFetchTodos]);

  const handleTodoDelete = useCallback(() => {
    // Temporarily disable auto-refresh to prevent infinite loops
    setShouldAutoRefresh(false);
    debouncedFetchTodos();
    // Re-enable auto-refresh after a delay
    setTimeout(() => setShouldAutoRefresh(true), 500);
  }, [debouncedFetchTodos]);

  const handleTodoToggleComplete = useCallback(() => {
    // Temporarily disable auto-refresh to prevent infinite loops
    setShouldAutoRefresh(false);
    debouncedFetchTodos();
    // Re-enable auto-refresh after a delay
    setTimeout(() => setShouldAutoRefresh(true), 500);
  }, [debouncedFetchTodos]);

  const handleTagClick = useCallback((tag: string) => {
    setFilters(prevFilters => ({ ...prevFilters, tag: prevFilters.tag === tag ? undefined : tag }));
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90" />

        {/* Navbar */}
        <div className="relative z-10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">TaskFlow Pro</h1>
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200 font-medium border border-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-emerald-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full backdrop-blur-sm mb-6 border border-emerald-500/20">
              <span className="text-emerald-400 text-sm font-medium">PROFESSIONAL PRODUCTIVITY</span>
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Streamline Your Workflow
              <span className="block mt-3 text-emerald-300">With Advanced Task Management</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              TaskFlow Pro empowers teams and professionals with intuitive tools to organize, prioritize, and execute tasks efficiently. Boost productivity and achieve your goals with our comprehensive task management solution.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 inline-block"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold text-lg transition-all duration-200 border border-white/20 inline-block"
                >
                  Sign In
                </Link>
              </div>
            )}
            {user && (
              <div className="inline-flex flex-wrap items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-slate-300">Welcome back,</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>
            )}
          </div>

          {/* Wave Decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 -mt-8 relative z-10">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {user && (
          <>
            {/* Add Todo Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Add New Task
              </h3>
              <TodoForm onTodoCreated={handleTodoCreated} apiUrl={apiUrl} />
            </div>

            {/* Filter and Sort Bar */}
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
              todos={todos}
            />

            {/* Sort Controls */}
            <div className="mb-4 bg-white rounded-xl shadow-md p-4 border border-gray-100 flex justify-end">
              <SortControls sort={sort} onSortChange={setSort} />
            </div>

            {/* Todos Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  Your Tasks
                  <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    {todos.length}
                  </span>
                </h3>
              </div>

              {(loading || isFetching) ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-500">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {loading ? 'Loading tasks...' : 'Refreshing...'}
                  </div>
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">No tasks yet</p>
                  <p className="text-sm text-gray-400">Add your first task above!</p>
                </div>
              ) : (
                <TodoList
                  todos={todos}
                  onTodoUpdate={handleTodoUpdate}
                  onTodoDelete={handleTodoDelete}
                  onTodoToggleComplete={handleTodoToggleComplete}
                  onTagClick={handleTagClick}
                  apiUrl={apiUrl}
                />
              )}
            </div>
          </>
        )}

        {!user && (
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign in to continue</h3>
            <p className="text-gray-500 mb-6">Please login or create an account to manage your tasks</p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-200"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>TaskFlow - Organize your life, one task at a time</p>
      </footer>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
