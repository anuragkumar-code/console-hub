import api, { ApiResponse } from '@/services/api';
import type {
  PlatformStats,
  OrganizationDashboardStats,
  DashboardChartData,
  ActivityItem,
  DashboardOverview,
  PlatformOverview,
  DashboardParams,
} from './types';

// ============================================
// Dashboard Service
// ============================================

export const dashboardService = {
  /**
   * Get platform-wide overview (God Admin only)
   */
  getPlatformOverview: async (params?: DashboardParams): Promise<PlatformOverview> => {
    const response = await api.get<ApiResponse<PlatformOverview>>(
      '/dashboard/platform',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get platform statistics
   */
  getPlatformStats: async (params?: DashboardParams): Promise<PlatformStats> => {
    const response = await api.get<ApiResponse<PlatformStats>>(
      '/dashboard/platform/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get organization dashboard overview
   */
  getOrganizationOverview: async (params?: DashboardParams): Promise<DashboardOverview> => {
    const response = await api.get<ApiResponse<DashboardOverview>>(
      '/dashboard',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get organization statistics
   */
  getOrganizationStats: async (params?: DashboardParams): Promise<OrganizationDashboardStats> => {
    const response = await api.get<ApiResponse<OrganizationDashboardStats>>(
      '/dashboard/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get dashboard chart data
   */
  getChartData: async (params?: DashboardParams): Promise<DashboardChartData> => {
    const response = await api.get<ApiResponse<DashboardChartData>>(
      '/dashboard/charts',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (limit?: number): Promise<ActivityItem[]> => {
    const response = await api.get<ApiResponse<ActivityItem[]>>(
      '/dashboard/activity',
      { params: { limit } }
    );
    return response.data.data;
  },
};

export default dashboardService;
