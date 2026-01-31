import api, { ApiResponse } from '@/services/api';
import type {
  AuditLog,
  AuditLogListParams,
  AuditLogStats,
  PaginatedResponse,
} from './types';

// ============================================
// Audit Log Service
// ============================================

export const auditService = {
  /**
   * Get all audit logs (paginated)
   */
  getAll: async (params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<AuditLog>>>(
      '/audit-logs',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get audit log by ID
   */
  getById: async (id: string): Promise<AuditLog> => {
    const response = await api.get<ApiResponse<AuditLog>>(
      `/audit-logs/${id}`
    );
    return response.data.data;
  },

  /**
   * Get audit log statistics
   */
  getStats: async (params?: { date_from?: string; date_to?: string }): Promise<AuditLogStats> => {
    const response = await api.get<ApiResponse<AuditLogStats>>(
      '/audit-logs/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Export audit logs
   */
  export: async (params?: AuditLogListParams): Promise<Blob> => {
    const response = await api.get(
      '/audit-logs/export',
      { 
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get audit logs for a specific resource
   */
  getByResource: async (resource: string, resourceId: string): Promise<AuditLog[]> => {
    const response = await api.get<ApiResponse<AuditLog[]>>(
      `/audit-logs/resource/${resource}/${resourceId}`
    );
    return response.data.data;
  },

  /**
   * Get audit logs for a specific user
   */
  getByUser: async (userId: string, params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<AuditLog>>>(
      `/audit-logs/user/${userId}`,
      { params }
    );
    return response.data.data;
  },
};

export default auditService;
