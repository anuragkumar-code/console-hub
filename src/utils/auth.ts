/**
 * Auth utilities - convenience wrapper around storage module
 */

import { storage } from '@/services/api';

// Token management
export const setTokens = (accessToken: string, refreshToken: string): void => {
  storage.setAccessToken(accessToken);
  storage.setRefreshToken(refreshToken);
};

export const getAccessToken = (): string | null => {
  return storage.getAccessToken();
};

export const getRefreshToken = (): string | null => {
  return storage.getRefreshToken();
};

export const removeTokens = (): void => {
  storage.clearAuth();
};

export const isAuthenticated = (): boolean => {
  return storage.isAuthenticated();
};

// User management
export const setUser = <T>(user: T): void => {
  storage.setUser(user);
};

export const getUser = <T>(): T | null => {
  return storage.getUser<T>();
};

// Clear all auth data
export const clearAuth = (): void => {
  storage.clearAuth();
};
