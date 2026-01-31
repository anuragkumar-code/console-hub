import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { PermissionAction } from '@/types';

/**
 * Hook for checking user permissions
 * Provides convenient methods for permission checking in components
 */
export function usePermission() {
  const { user, hasPermission, isGodAdmin } = useAuth();

  /**
   * Check if user can perform an action on a resource
   */
  const can = useCallback(
    (resource: string, action: PermissionAction): boolean => {
      return hasPermission(resource, action);
    },
    [hasPermission]
  );

  /**
   * Check if user can read a resource
   */
  const canRead = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, 'read');
    },
    [hasPermission]
  );

  /**
   * Check if user can create in a resource
   */
  const canCreate = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, 'create');
    },
    [hasPermission]
  );

  /**
   * Check if user can update a resource
   */
  const canUpdate = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, 'update');
    },
    [hasPermission]
  );

  /**
   * Check if user can delete from a resource
   */
  const canDelete = useCallback(
    (resource: string): boolean => {
      return hasPermission(resource, 'delete');
    },
    [hasPermission]
  );

  /**
   * Check multiple permissions at once
   * Returns true if user has ALL specified permissions
   */
  const canAll = useCallback(
    (permissions: Array<{ resource: string; action: PermissionAction }>): boolean => {
      return permissions.every((p) => hasPermission(p.resource, p.action));
    },
    [hasPermission]
  );

  /**
   * Check multiple permissions at once
   * Returns true if user has ANY of the specified permissions
   */
  const canAny = useCallback(
    (permissions: Array<{ resource: string; action: PermissionAction }>): boolean => {
      return permissions.some((p) => hasPermission(p.resource, p.action));
    },
    [hasPermission]
  );

  return {
    // General permission check
    can,
    
    // Shorthand methods for common actions
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    
    // Multiple permission checks
    canAll,
    canAny,
    
    // User info
    isGodAdmin,
    user,
    
    // Role info
    roleName: user?.role?.name ?? '',
    roleSlug: user?.role?.slug ?? '',
  };
}

/**
 * Type guard for checking if permission exists
 */
export function isValidPermission(
  permission: unknown
): permission is { resource: string; action: PermissionAction } {
  return (
    typeof permission === 'object' &&
    permission !== null &&
    'resource' in permission &&
    'action' in permission &&
    typeof (permission as { resource: string }).resource === 'string' &&
    ['read', 'create', 'update', 'delete'].includes(
      (permission as { action: string }).action
    )
  );
}
