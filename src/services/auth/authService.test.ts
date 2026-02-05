import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from './authService';
import { setTokens, getAccessToken, removeTokens } from '@/utils/auth';

describe('authService', () => {
  beforeEach(() => {
    // Clear tokens before each test
    removeTokens();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const result = await authService.login({
        identifier: 'admin@acme.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('admin@acme.com');
      expect(result.first_name).toBe('John');
      expect(result.role).toBeDefined();
      
      // Check that tokens are stored
      expect(getAccessToken()).toBe('mock-access-token');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        authService.login({
          identifier: 'wrong@email.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      // First set tokens
      setTokens('mock-access-token', 'mock-refresh-token');
      expect(getAccessToken()).toBe('mock-access-token');

      // Logout
      await authService.logout();

      // Tokens should be removed
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return current user profile when authenticated', async () => {
      // Set auth token
      setTokens('mock-access-token', 'mock-refresh-token');

      const user = await authService.getProfile();

      expect(user).toBeDefined();
      expect(user.email).toBe('admin@acme.com');
      expect(user.first_name).toBe('John');
      expect(user.role).toBeDefined();
    });

    it('should throw error when not authenticated', async () => {
      // No token set
      await expect(authService.getProfile()).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      // Set initial tokens
      setTokens('old-access-token', 'mock-refresh-token');

      const newToken = await authService.refreshToken();

      expect(newToken).toBe('new-access-token');
      expect(getAccessToken()).toBe('new-access-token');
    });

    it('should throw error when no refresh token exists', async () => {
      // No tokens set
      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
    });
  });
});

describe('Token utilities', () => {
  beforeEach(() => {
    removeTokens();
  });

  it('should set and get tokens correctly', () => {
    setTokens('access-123', 'refresh-456');

    expect(getAccessToken()).toBe('access-123');
  });

  it('should remove tokens correctly', () => {
    setTokens('access-123', 'refresh-456');
    removeTokens();

    expect(getAccessToken()).toBeNull();
  });

  it('should return null when no token is set', () => {
    expect(getAccessToken()).toBeNull();
  });
});

describe('Utility methods', () => {
  beforeEach(() => {
    removeTokens();
  });

  it('should check if authenticated', () => {
    expect(authService.isAuthenticated()).toBe(false);

    setTokens('access-token', 'refresh-token');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('should get stored user', () => {
    expect(authService.getStoredUser()).toBeNull();
  });

  it('should clear auth data', () => {
    setTokens('access-token', 'refresh-token');
    authService.clearAuth();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
