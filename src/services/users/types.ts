// ============================================
// User Types
// ============================================

import type { Role } from '@/types';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * User preferences stored as JSONB
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  [key: string]: unknown;
}

/**
 * User from API response
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role_id: string;
  role?: Role;
  organization_id?: string;
  organization_name?: string;
  status: UserStatus;
  email_verified?: boolean;
  two_factor_enabled?: boolean;
  last_login_at?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  email: string;
  password?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role_id: string;
  organization_id?: string;
  status?: UserStatus;
  send_invite?: boolean;
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role_id?: string;
  status?: UserStatus;
  preferences?: UserPreferences;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * User list query params
 */
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role_id?: string;
  organization_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
