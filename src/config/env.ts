/**
 * Environment Configuration
 * 
 * This file centralizes all environment variables and provides fallback values.
 * In production, create a .env file with:
 * 
 * VITE_API_BASE_URL=http://localhost:3000/api/v1
 * VITE_ACCESS_TOKEN_KEY=omni_access_token
 * VITE_REFRESH_TOKEN_KEY=omni_refresh_token
 * VITE_USER_KEY=omni_user
 */

export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // Storage Keys
  accessTokenKey: import.meta.env.VITE_ACCESS_TOKEN_KEY || 'omni_access_token',
  refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'omni_refresh_token',
  userKey: import.meta.env.VITE_USER_KEY || 'omni_user',
  
  // Token Expiry (1 hour in milliseconds)
  tokenExpiry: Number(import.meta.env.VITE_TOKEN_EXPIRY) || 3600000,
} as const;

export type Config = typeof config;
