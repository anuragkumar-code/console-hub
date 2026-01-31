// ============================================
// Role & Permission Types
// ============================================

import type { PermissionAction } from '@/types';

/**
 * Permission from API response
 */
export interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: PermissionAction;
  description?: string;
  module?: string;
  is_system?: boolean;
}

/**
 * Role from API response
 */
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_system: boolean;
  organization_id?: string | null;
  permissions?: Permission[];
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create role request
 */
export interface CreateRoleRequest {
  name: string;
  slug?: string;
  description?: string;
  permission_ids?: string[];
}

/**
 * Update role request
 */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permission_ids?: string[];
}

/**
 * Assign permissions to role request
 */
export interface AssignPermissionsRequest {
  permission_ids: string[];
}

/**
 * Role list query params
 */
export interface RoleListParams {
  page?: number;
  limit?: number;
  search?: string;
  is_system?: boolean;
  organization_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Permission list query params
 */
export interface PermissionListParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  resource?: string;
}

/**
 * Grouped permissions by module
 */
export interface GroupedPermissions {
  [module: string]: Permission[];
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
