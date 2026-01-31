import api, { ApiResponse } from '@/services/api';
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  RoleListParams,
  PermissionListParams,
  GroupedPermissions,
  PaginatedResponse,
} from './types';

// ============================================
// Role Service
// ============================================

export const roleService = {
  /**
   * Get all roles (paginated)
   */
  getAll: async (params?: RoleListParams): Promise<PaginatedResponse<Role>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Role>>>(
      '/roles',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<Role> => {
    const response = await api.get<ApiResponse<Role>>(
      `/roles/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new role
   */
  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await api.post<ApiResponse<Role>>(
      '/roles',
      data
    );
    return response.data.data;
  },

  /**
   * Update a role
   */
  update: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await api.put<ApiResponse<Role>>(
      `/roles/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a role
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  /**
   * Get permissions for a role
   */
  getPermissions: async (id: string): Promise<Permission[]> => {
    const response = await api.get<ApiResponse<Permission[]>>(
      `/roles/${id}/permissions`
    );
    return response.data.data;
  },

  /**
   * Assign permissions to a role
   */
  assignPermissions: async (id: string, data: AssignPermissionsRequest): Promise<Role> => {
    const response = await api.put<ApiResponse<Role>>(
      `/roles/${id}/permissions`,
      data
    );
    return response.data.data;
  },
};

// ============================================
// Permission Service
// ============================================

export const permissionService = {
  /**
   * Get all permissions (paginated)
   */
  getAll: async (params?: PermissionListParams): Promise<PaginatedResponse<Permission>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Permission>>>(
      '/permissions',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get permissions grouped by module
   */
  getGrouped: async (): Promise<GroupedPermissions> => {
    const response = await api.get<ApiResponse<GroupedPermissions>>(
      '/permissions/grouped'
    );
    return response.data.data;
  },

  /**
   * Get permission by ID
   */
  getById: async (id: string): Promise<Permission> => {
    const response = await api.get<ApiResponse<Permission>>(
      `/permissions/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new permission (admin only)
   */
  create: async (data: Partial<Permission>): Promise<Permission> => {
    const response = await api.post<ApiResponse<Permission>>(
      '/permissions',
      data
    );
    return response.data.data;
  },
};

export default { roleService, permissionService };
