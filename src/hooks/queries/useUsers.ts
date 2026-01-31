import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/users';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
} from '@/services/users';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated users
 */
export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAll(params),
  });
}

/**
 * Hook to fetch a single user
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: 'User created',
        description: `${newUser.first_name} ${newUser.last_name || ''} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating user',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser.id) });
      toast({
        title: 'User updated',
        description: `${updatedUser.first_name} ${updatedUser.last_name || ''} has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating user',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: 'User deleted',
        description: 'The user has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting user',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to deactivate a user
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
      toast({
        title: 'User deactivated',
        description: `${user.first_name} ${user.last_name || ''} has been deactivated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deactivating user',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to activate a user
 */
export function useActivateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.activate(id),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
      toast({
        title: 'User activated',
        description: `${user.first_name} ${user.last_name || ''} has been activated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error activating user',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to resend user invitation
 */
export function useResendInvite() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.resendInvite(id),
    onSuccess: () => {
      toast({
        title: 'Invitation sent',
        description: 'The invitation email has been resent.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error sending invitation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
