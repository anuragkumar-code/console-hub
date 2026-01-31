import { useQuery, useMutation } from '@tanstack/react-query';
import { auditService } from '@/services/audit';
import type { AuditLogListParams } from '@/services/audit';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const auditLogKeys = {
  all: ['auditLogs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (params?: AuditLogListParams) => [...auditLogKeys.lists(), params] as const,
  details: () => [...auditLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
  stats: (params?: { date_from?: string; date_to?: string }) => [...auditLogKeys.all, 'stats', params] as const,
  byResource: (resource: string, resourceId: string) => [...auditLogKeys.all, 'resource', resource, resourceId] as const,
  byUser: (userId: string, params?: AuditLogListParams) => [...auditLogKeys.all, 'user', userId, params] as const,
};

/**
 * Hook to fetch paginated audit logs
 */
export function useAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => auditService.getAll(params),
  });
}

/**
 * Hook to fetch a single audit log
 */
export function useAuditLog(id: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => auditService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch audit log statistics
 */
export function useAuditLogStats(params?: { date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: auditLogKeys.stats(params),
    queryFn: () => auditService.getStats(params),
  });
}

/**
 * Hook to fetch audit logs for a specific resource
 */
export function useAuditLogsByResource(resource: string, resourceId: string) {
  return useQuery({
    queryKey: auditLogKeys.byResource(resource, resourceId),
    queryFn: () => auditService.getByResource(resource, resourceId),
    enabled: !!resource && !!resourceId,
  });
}

/**
 * Hook to fetch audit logs for a specific user
 */
export function useAuditLogsByUser(userId: string, params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.byUser(userId, params),
    queryFn: () => auditService.getByUser(userId, params),
    enabled: !!userId,
  });
}

/**
 * Hook to export audit logs
 */
export function useExportAuditLogs() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params?: AuditLogListParams) => auditService.export(params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export complete',
        description: 'Audit logs have been downloaded.',
      });
    },
    onError: () => {
      toast({
        title: 'Export failed',
        description: 'Failed to export audit logs. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
