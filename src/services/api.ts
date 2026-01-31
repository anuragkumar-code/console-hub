import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';

// ============================================
// Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Extend AxiosRequestConfig to track retry attempts
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ============================================
// Storage Helpers
// ============================================

export const storage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(config.accessTokenKey);
  },
  
  setAccessToken: (token: string): void => {
    localStorage.setItem(config.accessTokenKey, token);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(config.refreshTokenKey);
  },
  
  setRefreshToken: (token: string): void => {
    localStorage.setItem(config.refreshTokenKey, token);
  },
  
  getUser: <T>(): T | null => {
    const user = localStorage.getItem(config.userKey);
    if (!user) return null;
    try {
      return JSON.parse(user) as T;
    } catch {
      return null;
    }
  },
  
  setUser: <T>(user: T): void => {
    localStorage.setItem(config.userKey, JSON.stringify(user));
  },
  
  clearAuth: (): void => {
    localStorage.removeItem(config.accessTokenKey);
    localStorage.removeItem(config.refreshTokenKey);
    localStorage.removeItem(config.userKey);
  },
  
  isAuthenticated: (): boolean => {
    return !!storage.getAccessToken();
  },
};

// ============================================
// Axios Instance
// ============================================

const api: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// ============================================

api.interceptors.request.use(
  (axiosConfig: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor with Token Refresh
// ============================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Check if we have a refresh token
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      // No refresh token, clear auth and redirect to login
      storage.clearAuth();
      window.location.href = '/';
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh token endpoint
      const response = await axios.post<ApiResponse<{ token: string; refreshToken?: string }>>(
        `${config.apiBaseUrl}/auth/refresh-token`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
      
      // Store new tokens
      storage.setAccessToken(newToken);
      if (newRefreshToken) {
        storage.setRefreshToken(newRefreshToken);
      }

      // Update authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // Process queued requests
      processQueue(null, newToken);

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear auth and redirect to login
      processQueue(refreshError as Error, null);
      storage.clearAuth();
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ============================================
// API Helper Methods
// ============================================

export const apiHelpers = {
  /**
   * Check if error is an API error
   */
  isApiError: (error: unknown): error is AxiosError<ApiError> => {
    return axios.isAxiosError(error);
  },

  /**
   * Extract error message from API error
   */
  getErrorMessage: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      // Check for API error response
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      // Check for network error
      if (error.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
      }
      if (error.code === 'ERR_NETWORK') {
        return 'Network error. Please check your connection.';
      }
      // Check for standard HTTP errors
      if (error.response?.status) {
        switch (error.response.status) {
          case 400:
            return 'Invalid request. Please check your input.';
          case 401:
            return 'Session expired. Please login again.';
          case 403:
            return 'You do not have permission to perform this action.';
          case 404:
            return 'Resource not found.';
          case 500:
            return 'Server error. Please try again later.';
          default:
            return `Error: ${error.response.statusText}`;
        }
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  },

  /**
   * Extract field errors from API error
   */
  getFieldErrors: (error: unknown): Record<string, string> => {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      const fieldErrors: Record<string, string> = {};
      error.response.data.errors.forEach((err: { field: string; message: string }) => {
        fieldErrors[err.field] = err.message;
      });
      return fieldErrors;
    }
    return {};
  },
};

export default api;
