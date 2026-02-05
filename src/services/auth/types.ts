import type { PermissionAction } from '@/types';

// ============================================
// API Permission & Role Types
// ============================================

/**
 * Permission from login API response
 * Format: { resource: "users", action: "read" }
 */
export interface ApiPermission {
  resource: string;
  action: PermissionAction;
}

/**
 * Role from login API response
 */
export interface ApiRole {
  id: string;
  name: string;
  slug: string;
  is_system: boolean;
  permissions: ApiPermission[];
}

/**
 * User from login API response
 */
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: ApiRole;
  organizationId?: string;
}

// ============================================
// Auth API Request/Response Types
// ============================================

/**
 * Login request payload
 * Note: Backend expects 'identifier' (can be email or username)
 */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/**
 * Login API response
 * Based on: {
 *   user: { ... },
 *   token: "jwt_token_here"
 * }
 */
export interface LoginResponseData {
  user: ApiUser;
  token: string;
  refreshToken?: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  organizationId?: string;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponseData {
  token: string;
  refreshToken?: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * OTP login request
 */
export interface OtpLoginRequest {
  email: string;
}

/**
 * OTP verify request
 */
export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

/**
 * User profile response
 */
export interface ProfileResponseData {
  user: ApiUser;
}

// ============================================
// Stored Auth State
// ============================================

/**
 * Auth data stored in localStorage
 * Includes computed isGodAdmin flag
 */
export interface StoredAuthUser extends ApiUser {
  isGodAdmin: boolean;
  organizationName?: string;
}
