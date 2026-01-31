import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { AuthUser, Permission, PermissionAction, Role } from '@/types';
import { routePermissions, publicRoutes } from '@/config/permissions';

// ============================================
// Types
// ============================================

interface AuthContextType {
  // User state
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Permission checking
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  canAccessRoute: (path: string) => boolean;
  isGodAdmin: boolean;
  
  // Auth actions (stubs for API integration)
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  
  // Legacy support - will be deprecated
  setUserRole: (roleSlug: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Mock Data for Development
// ============================================

// Mock permissions for different user types
const createMockPermissions = (permissionSlugs: string[]): Permission[] => {
  return permissionSlugs.map((slug, index) => {
    const [resource, action] = slug.split('.');
    return {
      id: `p-${index + 1}`,
      resource,
      action: action as PermissionAction,
      name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
    };
  });
};

// God Admin - has all permissions (bypasses checks anyway)
const godAdminPermissions = createMockPermissions([
  'organizations.read', 'organizations.create', 'organizations.update', 'organizations.delete',
  'users.read', 'users.create', 'users.update', 'users.delete',
  'roles.read', 'roles.create', 'roles.update', 'roles.delete',
  'permissions.read', 'permissions.create', 'permissions.update', 'permissions.delete',
  'contacts.read', 'contacts.create', 'contacts.update', 'contacts.delete',
  'accounts.read', 'accounts.create', 'accounts.update', 'accounts.delete',
  'deals.read', 'deals.create', 'deals.update', 'deals.delete',
  'tickets.read', 'tickets.create', 'tickets.update', 'tickets.delete',
  'channels.read', 'channels.create', 'channels.update', 'channels.delete',
  'conversations.read', 'conversations.create', 'conversations.update', 'conversations.delete',
  'teams.read', 'teams.create', 'teams.update', 'teams.delete',
  'audit_logs.read',
  'settings.read', 'settings.update',
  'dashboard.read',
]);

// Org Admin - full access within organization
const orgAdminPermissions = createMockPermissions([
  'users.read', 'users.create', 'users.update', 'users.delete',
  'roles.read', 'roles.create', 'roles.update', 'roles.delete',
  'contacts.read', 'contacts.create', 'contacts.update', 'contacts.delete',
  'accounts.read', 'accounts.create', 'accounts.update', 'accounts.delete',
  'deals.read', 'deals.create', 'deals.update', 'deals.delete',
  'tickets.read', 'tickets.create', 'tickets.update', 'tickets.delete',
  'channels.read', 'channels.create', 'channels.update', 'channels.delete',
  'conversations.read', 'conversations.create', 'conversations.update', 'conversations.delete',
  'teams.read', 'teams.create', 'teams.update', 'teams.delete',
  'settings.read', 'settings.update',
  'dashboard.read',
]);

// Agent - limited access
const agentPermissions = createMockPermissions([
  'contacts.read', 'contacts.create', 'contacts.update',
  'accounts.read',
  'deals.read', 'deals.create', 'deals.update',
  'tickets.read', 'tickets.create', 'tickets.update',
  'conversations.read', 'conversations.create', 'conversations.update',
  'channels.read',
  'teams.read',
  'dashboard.read',
]);

// Mock roles
const mockRoles: Record<string, Role> = {
  god_admin: {
    id: 'r-1',
    name: 'God Administrator',
    slug: 'god_admin',
    description: 'Full platform access with all permissions',
    is_system: true,
    organization_id: null,
    permissions: godAdminPermissions,
  },
  org_admin: {
    id: 'r-2',
    name: 'Organization Administrator',
    slug: 'org_admin',
    description: 'Full access to organization features',
    is_system: true,
    organization_id: null,
    permissions: orgAdminPermissions,
  },
  agent: {
    id: 'r-3',
    name: 'Agent',
    slug: 'agent',
    description: 'Standard agent access',
    is_system: true,
    organization_id: null,
    permissions: agentPermissions,
  },
};

// Mock users for different roles
const mockUsers: Record<string, AuthUser> = {
  god_admin: {
    id: '1',
    email: 'admin@platform.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: mockRoles.god_admin,
    isGodAdmin: true,
  },
  org_admin: {
    id: '2',
    email: 'admin@acme.com',
    firstName: 'John',
    lastName: 'Mitchell',
    role: mockRoles.org_admin,
    organizationId: 'org-1',
    organizationName: 'Acme Corporation',
    isGodAdmin: false,
  },
  agent: {
    id: '3',
    email: 'agent@acme.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: mockRoles.agent,
    organizationId: 'org-1',
    organizationName: 'Acme Corporation',
    isGodAdmin: false,
  },
};

// ============================================
// Provider Component
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to org_admin for development
  const [user, setUser] = useState<AuthUser | null>(mockUsers.org_admin);
  const [isLoading, setIsLoading] = useState(false);

  // Computed values
  const isAuthenticated = user !== null;
  const isGodAdmin = user?.isGodAdmin ?? false;

  /**
   * Check if user has a specific permission
   * God admin bypasses all permission checks
   */
  const hasPermission = useCallback((resource: string, action: PermissionAction): boolean => {
    // God admin bypasses all checks
    if (isGodAdmin) return true;
    
    // No user = no permission
    if (!user || !user.role?.permissions) return false;
    
    // Check if user has the specific permission
    return user.role.permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  }, [user, isGodAdmin]);

  /**
   * Check if user can access a specific route
   */
  const canAccessRoute = useCallback((path: string): boolean => {
    // God admin can access everything
    if (isGodAdmin) return true;
    
    // Public routes are always accessible
    if (publicRoutes.includes(path)) return true;
    
    // Check route permission
    const permission = routePermissions[path];
    if (!permission) {
      // Route not in permission map - default to accessible
      return true;
    }
    
    return hasPermission(permission.resource, permission.action);
  }, [hasPermission, isGodAdmin]);

  /**
   * Login function (stub for API integration)
   * In production, this will call the login API
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await authApi.login(email, password);
      // setUser(response.data.user);
      // localStorage.setItem('token', response.data.token);
      
      // For now, simulate login based on email
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      if (email.includes('god') || email.includes('super')) {
        setUser(mockUsers.god_admin);
      } else if (email.includes('admin')) {
        setUser(mockUsers.org_admin);
      } else {
        setUser(mockUsers.agent);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    setUser(null);
    // TODO: Clear token from localStorage
    // localStorage.removeItem('token');
  }, []);

  /**
   * Legacy function for role switching (demo purposes)
   * Will be deprecated once API is integrated
   */
  const setUserRole = useCallback((roleSlug: string) => {
    const mockUser = mockUsers[roleSlug];
    if (mockUser) {
      setUser(mockUser);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    canAccessRoute,
    isGodAdmin,
    login,
    logout,
    setUser,
    setUserRole,
  }), [
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    canAccessRoute,
    isGodAdmin,
    login,
    logout,
    setUserRole,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
