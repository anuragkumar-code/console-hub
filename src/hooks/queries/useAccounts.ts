import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/accounts';
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountListParams,
} from '@/services/accounts';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (params?: AccountListParams) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  contacts: (id: string) => [...accountKeys.detail(id), 'contacts'] as const,
  deals: (id: string) => [...accountKeys.detail(id), 'deals'] as const,
  activity: (id: string) => [...accountKeys.detail(id), 'activity'] as const,
};

/**
 * Hook to fetch paginated accounts
 */
export function useAccounts(params?: AccountListParams) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountService.getAll(params),
  });
}

/**
 * Hook to fetch a single account
 */
export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch contacts for an account
 */
export function useAccountContacts(id: string) {
  return useQuery({
    queryKey: accountKeys.contacts(id),
    queryFn: () => accountService.getContacts(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch deals for an account
 */
export function useAccountDeals(id: string) {
  return useQuery({
    queryKey: accountKeys.deals(id),
    queryFn: () => accountService.getDeals(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new account
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountService.create(data),
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast({
        title: 'Account created',
        description: `${newAccount.name} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating account',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an account
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountService.update(id, data),
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(updatedAccount.id) });
      toast({
        title: 'Account updated',
        description: `${updatedAccount.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating account',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast({
        title: 'Account deleted',
        description: 'The account has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting account',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to merge accounts
 */
export function useMergeAccounts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      accountService.merge(sourceId, targetId),
    onSuccess: (mergedAccount) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast({
        title: 'Accounts merged',
        description: `Accounts have been merged into ${mergedAccount.name}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error merging accounts',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
