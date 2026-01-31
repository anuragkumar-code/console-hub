import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService, permissionService } from '@/services/roles';
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleListParams,
  PermissionListParams,
  AssignPermissionsRequest,
  GroupedPermissions,
} from '@/services/roles';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: RoleListParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: (id: string) => [...roleKeys.detail(id), 'permissions'] as const,
};

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (params?: PermissionListParams) => [...permissionKeys.lists(), params] as const,
  grouped: () => [...permissionKeys.all, 'grouped'] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
};

// ============================================
// Role Hooks
// ============================================

/**
 * Hook to fetch paginated roles
 */
export function useRoles(params?: RoleListParams) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.getAll(params),
  });
}

/**
 * Hook to fetch a single role
 */
export function useRole(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch permissions for a role
 */
export function useRolePermissions(id: string) {
  return useQuery({
    queryKey: roleKeys.permissions(id),
    queryFn: () => roleService.getPermissions(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => roleService.create(data),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      toast({
        title: 'Role created',
        description: `${newRole.name} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating role',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      roleService.update(id, data),
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(updatedRole.id) });
      toast({
        title: 'Role updated',
        description: `${updatedRole.name} has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating role',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      toast({
        title: 'Role deleted',
        description: 'The role has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting role',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to assign permissions to a role
 */
export function useAssignPermissions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignPermissionsRequest }) =>
      roleService.assignPermissions(id, data),
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(updatedRole.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(updatedRole.id) });
      toast({
        title: 'Permissions updated',
        description: `Permissions for ${updatedRole.name} have been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating permissions',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// Permission Hooks
// ============================================

/**
 * Hook to fetch paginated permissions
 */
export function usePermissions(params?: PermissionListParams) {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () => permissionService.getAll(params),
  });
}

/**
 * Hook to fetch permissions grouped by module
 */
export function useGroupedPermissions() {
  return useQuery({
    queryKey: permissionKeys.grouped(),
    queryFn: () => permissionService.getGrouped(),
  });
}

/**
 * Hook to fetch a single permission
 */
export function usePermission(id: string) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: () => permissionService.getById(id),
    enabled: !!id,
  });
}
