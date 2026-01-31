import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import type { DashboardParams } from '@/services/dashboard';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  platformOverview: (params?: DashboardParams) => [...dashboardKeys.all, 'platform', 'overview', params] as const,
  platformStats: (params?: DashboardParams) => [...dashboardKeys.all, 'platform', 'stats', params] as const,
  organizationOverview: (params?: DashboardParams) => [...dashboardKeys.all, 'organization', 'overview', params] as const,
  organizationStats: (params?: DashboardParams) => [...dashboardKeys.all, 'organization', 'stats', params] as const,
  chartData: (params?: DashboardParams) => [...dashboardKeys.all, 'charts', params] as const,
  recentActivity: (limit?: number) => [...dashboardKeys.all, 'activity', limit] as const,
};

/**
 * Hook to fetch platform overview (God Admin)
 */
export function usePlatformOverview(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.platformOverview(params),
    queryFn: () => dashboardService.getPlatformOverview(params),
  });
}

/**
 * Hook to fetch platform statistics
 */
export function usePlatformStats(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.platformStats(params),
    queryFn: () => dashboardService.getPlatformStats(params),
  });
}

/**
 * Hook to fetch organization dashboard overview
 */
export function useOrganizationOverview(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.organizationOverview(params),
    queryFn: () => dashboardService.getOrganizationOverview(params),
  });
}

/**
 * Hook to fetch organization statistics
 */
export function useOrganizationStats(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.organizationStats(params),
    queryFn: () => dashboardService.getOrganizationStats(params),
  });
}

/**
 * Hook to fetch dashboard chart data
 */
export function useDashboardCharts(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.chartData(params),
    queryFn: () => dashboardService.getChartData(params),
  });
}

/**
 * Hook to fetch recent activity
 */
export function useRecentActivity(limit?: number) {
  return useQuery({
    queryKey: dashboardKeys.recentActivity(limit),
    queryFn: () => dashboardService.getRecentActivity(limit),
  });
}
