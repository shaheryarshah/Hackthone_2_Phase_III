/**
 * Better Auth configuration for JWT-based authentication.
 *
 * This module provides a custom authentication client that integrates
 * with the backend FastAPI JWT authentication system.
 */

import { createAuthClient } from 'better-auth';
import type { User, AuthResponse } from '@/types';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Custom authentication client that works with the FastAPI backend.
 *
 * Better Auth is configured with a custom plugin to handle JWT tokens
 * and communicate with our FastAPI authentication endpoints.
 */
export const auth = createAuthClient({
  baseURL: API_URL,
  plugins: [
    // Custom credentials plugin for email/password auth with JWT
    credentialsPlugin({
      endpoints: {
        signIn: '/auth/login',
        signUp: '/auth/register',
      },
    }),
  ],
});

/**
 * Credentials plugin configuration for custom JWT authentication.
 */
function credentialsPlugin(config: {
  endpoints: {
    signIn: string;
    signUp: string;
  };
}) {
  return {
    id: 'credentials',
    endpoints: {
      async signIn(data: { email: string; password: string }) {
        const response = await fetch(`${API_URL}${config.endpoints.signIn}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Login failed');
        }

        const authResponse: AuthResponse = await response.json();
        return authResponse;
      },
      async signUp(data: { email: string; password: string }) {
        const response = await fetch(`${API_URL}${config.endpoints.signUp}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Registration failed');
        }

        const authResponse: AuthResponse = await response.json();
        return authResponse;
      },
    },
  };
}

/**
 * Authentication helper functions for common operations.
 */
export const authHelpers = {
  /**
   * Get the current access token from storage.
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Store authentication data after successful login/register.
   */
  storeAuthData(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }
  },

  /**
   * Clear authentication data on logout.
   */
  clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get stored user data.
   */
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};

/**
 * API client with automatic JWT token attachment.
 *
 * This wraps axios to automatically include the Bearer token
 * in all authenticated requests.
 */
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authHelpers.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      authHelpers.clearAuthData();
      // Optionally redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
