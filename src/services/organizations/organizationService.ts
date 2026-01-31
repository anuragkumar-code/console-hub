import api, { ApiResponse } from '@/services/api';
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationListParams,
  OrganizationStats,
  PaginatedResponse,
} from './types';

// ============================================
// Organization Service
// ============================================

export const organizationService = {
  /**
   * Get all organizations (paginated)
   */
  getAll: async (params?: OrganizationListParams): Promise<PaginatedResponse<Organization>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Organization>>>(
      '/organizations',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get organization by ID
   */
  getById: async (id: string): Promise<Organization> => {
    const response = await api.get<ApiResponse<Organization>>(
      `/organizations/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new organization
   */
  create: async (data: CreateOrganizationRequest): Promise<Organization> => {
    const response = await api.post<ApiResponse<Organization>>(
      '/organizations',
      data
    );
    return response.data.data;
  },

  /**
   * Update an organization
   */
  update: async (id: string, data: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await api.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete an organization (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
  },

  /**
   * Get organization statistics
   */
  getStats: async (id: string): Promise<OrganizationStats> => {
    const response = await api.get<ApiResponse<OrganizationStats>>(
      `/organizations/${id}/stats`
    );
    return response.data.data;
  },

  /**
   * Suspend an organization
   */
  suspend: async (id: string): Promise<Organization> => {
    const response = await api.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      { status: 'suspended' }
    );
    return response.data.data;
  },

  /**
   * Activate an organization
   */
  activate: async (id: string): Promise<Organization> => {
    const response = await api.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Update organization settings
   */
  updateSettings: async (id: string, settings: Organization['settings']): Promise<Organization> => {
    const response = await api.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      { settings }
    );
    return response.data.data;
  },
};

export default organizationService;
