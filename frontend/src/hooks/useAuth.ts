'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, AuthResponse, AuthError } from '@/types';
import { authHelpers, apiClient } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component that manages auth state.
 *
 * Handles login, registration, logout, and session persistence
 * using localStorage for token storage.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = authHelpers.getStoredUser();
      const token = authHelpers.getAccessToken();

      if (storedUser && token) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      authHelpers.storeAuthData(response.data);
      setUser(response.data.user);
    } catch (err: unknown) {
      const authError = err as { response?: { data?: { detail?: string } } };
      const errorMessage = authError.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        email,
        password,
      });

      authHelpers.storeAuthData(response.data);
      setUser(response.data.user);
    } catch (err: unknown) {
      const authError = err as { response?: { data?: { detail?: string } } };
      const errorMessage = authError.response?.data?.detail || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authHelpers.clearAuthData();
    setUser(null);
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context.
 *
 * @returns Authentication context with user, login, logout, etc.
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to get the current access token.
 * Useful for making direct API calls.
 */
export function useAccessToken(): string | null {
  return authHelpers.getAccessToken();
}

/**
 * Hook to check if user is authenticated.
 * Returns false while loading.
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return false;
  return isAuthenticated;
}
