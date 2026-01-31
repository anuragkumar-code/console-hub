import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organizations';
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationListParams,
} from '@/services/organizations';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (params?: OrganizationListParams) => [...organizationKeys.lists(), params] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  stats: (id: string) => [...organizationKeys.detail(id), 'stats'] as const,
};

/**
 * Hook to fetch paginated organizations
 */
export function useOrganizations(params?: OrganizationListParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationService.getAll(params),
  });
}

/**
 * Hook to fetch a single organization
 */
export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch organization statistics
 */
export function useOrganizationStats(id: string) {
  return useQuery({
    queryKey: organizationKeys.stats(id),
    queryFn: () => organizationService.getStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new organization
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => organizationService.create(data),
    onSuccess: (newOrg) => {
      // Invalidate and refetch organizations list
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      toast({
        title: 'Organization created',
        description: `${newOrg.name} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating organization',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an organization
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationRequest }) =>
      organizationService.update(id, data),
    onSuccess: (updatedOrg) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(updatedOrg.id) });
      toast({
        title: 'Organization updated',
        description: `${updatedOrg.name} has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating organization',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an organization
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => organizationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      toast({
        title: 'Organization deleted',
        description: 'The organization has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting organization',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to suspend an organization
 */
export function useSuspendOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => organizationService.suspend(id),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(org.id) });
      toast({
        title: 'Organization suspended',
        description: `${org.name} has been suspended.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error suspending organization',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to activate an organization
 */
export function useActivateOrganization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => organizationService.activate(id),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(org.id) });
      toast({
        title: 'Organization activated',
        description: `${org.name} has been activated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error activating organization',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
