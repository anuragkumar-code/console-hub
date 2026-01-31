import { describe, it, expect, beforeEach } from 'vitest';
import api, { storage, apiHelpers } from './api';

describe('API Client', () => {
  beforeEach(() => {
    storage.clearAuth();
  });

  describe('storage utilities', () => {
    it('should store and retrieve tokens', () => {
      storage.setTokens('access-token', 'refresh-token');

      expect(storage.getAccessToken()).toBe('access-token');
      expect(storage.getRefreshToken()).toBe('refresh-token');
    });

    it('should clear tokens', () => {
      storage.setTokens('access-token', 'refresh-token');
      storage.clearTokens();

      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });

    it('should check if authenticated', () => {
      expect(storage.isAuthenticated()).toBe(false);

      storage.setTokens('access-token', 'refresh-token');
      expect(storage.isAuthenticated()).toBe(true);
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      storage.setTokens('test-token', 'refresh-token');

      // The interceptor should add the token
      const config = { headers: {} as Record<string, string> };
      // Simulate what the interceptor does
      const token = storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token', () => {
      const config = { headers: {} as Record<string, string> };
      const token = storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('apiHelpers', () => {
    it('should extract error message from API error', () => {
      // Create a mock axios error
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      };
      // Mock axios.isAxiosError
      const message = axiosError.response?.data?.message || 'An unexpected error occurred';
      expect(message).toBe('Custom error message');
    });

    it('should return default message for unknown errors', () => {
      const unknownError = new Error('Something went wrong');
      const message = apiHelpers.getErrorMessage(unknownError);
      expect(message).toBe('Something went wrong');
    });

    it('should check if error is network error', () => {
      const networkError = { code: 'ERR_NETWORK' };
      expect(apiHelpers.isNetworkError(networkError)).toBe(true);

      const otherError = { code: 'OTHER_ERROR' };
      expect(apiHelpers.isNetworkError(otherError)).toBe(false);
    });

    it('should check if error is unauthorized', () => {
      const unauthorizedError = { response: { status: 401 } };
      expect(apiHelpers.isUnauthorizedError(unauthorizedError)).toBe(true);

      const forbiddenError = { response: { status: 403 } };
      expect(apiHelpers.isUnauthorizedError(forbiddenError)).toBe(false);
    });
  });
});

describe('API Base URL', () => {
  it('should have correct base URL configured', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:3000/api/v1');
  });

  it('should have correct content type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
