import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealService } from '@/services/deals';
import type {
  Deal,
  CreateDealRequest,
  UpdateDealRequest,
  DealListParams,
  DealStage,
} from '@/services/deals';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (params?: DealListParams) => [...dealKeys.lists(), params] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
  stats: (params?: { owner_id?: string; date_from?: string; date_to?: string }) => 
    [...dealKeys.all, 'stats', params] as const,
  pipelines: () => [...dealKeys.all, 'pipelines'] as const,
  activity: (id: string) => [...dealKeys.detail(id), 'activity'] as const,
};

/**
 * Hook to fetch paginated deals
 */
export function useDeals(params?: DealListParams) {
  return useQuery({
    queryKey: dealKeys.list(params),
    queryFn: () => dealService.getAll(params),
  });
}

/**
 * Hook to fetch a single deal
 */
export function useDeal(id: string) {
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: () => dealService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch deal statistics
 */
export function useDealStats(params?: { owner_id?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: dealKeys.stats(params),
    queryFn: () => dealService.getStats(params),
  });
}

/**
 * Hook to fetch pipelines
 */
export function usePipelines() {
  return useQuery({
    queryKey: dealKeys.pipelines(),
    queryFn: () => dealService.getPipelines(),
  });
}

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDealRequest) => dealService.create(data),
    onSuccess: (newDeal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: 'Deal created',
        description: `${newDeal.title} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating deal',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealRequest }) =>
      dealService.update(id, data),
    onSuccess: (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(updatedDeal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: 'Deal updated',
        description: `${updatedDeal.title} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating deal',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => dealService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: 'Deal deleted',
        description: 'The deal has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting deal',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update deal stage
 */
export function useUpdateDealStage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) =>
      dealService.updateStage(id, stage),
    onSuccess: (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(updatedDeal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: 'Deal stage updated',
        description: `${updatedDeal.title} moved to ${updatedDeal.stage.replace('_', ' ')}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating deal stage',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to mark deal as won
 */
export function useMarkDealAsWon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, actualCloseDate }: { id: string; actualCloseDate?: string }) =>
      dealService.markAsWon(id, actualCloseDate),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: '🎉 Deal won!',
        description: `Congratulations! ${deal.title} has been marked as won.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error closing deal',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to mark deal as lost
 */
export function useMarkDealAsLost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, lossReason }: { id: string; lossReason?: string }) =>
      dealService.markAsLost(id, lossReason),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.stats() });
      toast({
        title: 'Deal closed',
        description: `${deal.title} has been marked as lost.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error closing deal',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
