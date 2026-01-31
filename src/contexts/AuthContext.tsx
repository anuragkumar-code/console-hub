import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { authService, apiHelpers } from '@/services/auth';
import type { StoredAuthUser } from '@/services/auth';
import type { PermissionAction } from '@/types';
import { routePermissions, publicRoutes } from '@/config/permissions';

// ============================================
// Types
// ============================================

interface AuthContextType {
  // User state
  user: StoredAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Permission checking
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  canAccessRoute: (path: string) => boolean;
  isGodAdmin: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  
  // For manual user updates (e.g., after profile update)
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize user from localStorage
  const [user, setUser] = useState<StoredAuthUser | null>(() => {
    return authService.getStoredUser();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = user !== null;
  const isGodAdmin = user?.isGodAdmin ?? false;

  /**
   * Initialize auth state on mount
   * Validates stored token by fetching profile
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a stored token
      if (!authService.isAuthenticated()) {
        setIsInitializing(false);
        return;
      }

      try {
        // Validate token by fetching profile
        const profile = await authService.getProfile();
        setUser(profile);
      } catch {
        // Token invalid or expired - clear auth
        authService.clearAuth();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

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
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } catch (err) {
      const errorMessage = apiHelpers.getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout and clear all auth data
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      // Token might be expired
      authService.clearAuth();
      setUser(null);
    }
  }, [isAuthenticated]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated,
    isLoading: isLoading || isInitializing,
    error,
    hasPermission,
    canAccessRoute,
    isGodAdmin,
    login,
    logout,
    clearError,
    refreshUser,
  }), [
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    hasPermission,
    canAccessRoute,
    isGodAdmin,
    login,
    logout,
    clearError,
    refreshUser,
  ]);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
