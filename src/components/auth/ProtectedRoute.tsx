import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { PermissionAction } from '@/types';
import Forbidden from '@/pages/Forbidden';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Resource required to access this route
   */
  resource?: string;
  /**
   * Action required (defaults to 'read')
   */
  action?: PermissionAction;
  /**
   * If true, only god admin can access this route
   */
  godAdminOnly?: boolean;
  /**
   * Fallback component to show when access is denied
   * Defaults to Forbidden page
   */
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute component that guards routes based on permissions
 * 
 * Usage:
 * ```tsx
 * <Route path="/contacts" element={
 *   <ProtectedRoute resource="contacts">
 *     <Contacts />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export function ProtectedRoute({
  children,
  resource,
  action = 'read',
  godAdminOnly = false,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isGodAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is being checked
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // God admin bypasses all permission checks
  if (isGodAdmin) {
    return <>{children}</>;
  }

  // Check god admin only routes
  if (godAdminOnly) {
    return fallback ? <>{fallback}</> : <Forbidden />;
  }

  // Check resource permission if specified
  if (resource && !hasPermission(resource, action)) {
    return fallback ? <>{fallback}</> : <Forbidden />;
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Higher-order component version of ProtectedRoute
 * 
 * Usage:
 * ```tsx
 * const ProtectedContacts = withProtectedRoute(Contacts, { resource: 'contacts' });
 * ```
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Component that only renders children if user has permission
 * Useful for conditionally showing UI elements
 * 
 * Usage:
 * ```tsx
 * <PermissionGate resource="contacts" action="create">
 *   <Button>Add Contact</Button>
 * </PermissionGate>
 * ```
 */
interface PermissionGateProps {
  children: React.ReactNode;
  resource: string;
  action: PermissionAction;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  resource,
  action,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, isGodAdmin } = useAuth();

  if (isGodAdmin || hasPermission(resource, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default ProtectedRoute;
