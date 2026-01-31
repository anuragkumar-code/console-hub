import api, { ApiResponse } from '@/services/api';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserListParams,
  PaginatedResponse,
} from './types';

// ============================================
// User Service
// ============================================

export const userService = {
  /**
   * Get all users (paginated)
   */
  getAll: async (params?: UserListParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      '/users',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(
      `/users/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new user
   */
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>(
      '/users',
      data
    );
    return response.data.data;
  },

  /**
   * Update a user
   */
  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a user (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  /**
   * Deactivate a user
   */
  deactivate: async (id: string): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/users/${id}`,
      { status: 'inactive' }
    );
    return response.data.data;
  },

  /**
   * Activate a user
   */
  activate: async (id: string): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/users/${id}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Change user password (for current user)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/users/change-password',
      data
    );
    return response.data.data;
  },

  /**
   * Resend invitation email
   */
  resendInvite: async (id: string): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/users/${id}/resend-invite`
    );
    return response.data.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (id: string, preferences: User['preferences']): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/users/${id}`,
      { preferences }
    );
    return response.data.data;
  },
};

export default userService;
