import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { currentUser as defaultUser } from '@/data/mockData';

interface AuthContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const setUserRole = (role: UserRole) => {
    setUser(prev => ({
      ...prev,
      role,
      organizationName: role === 'god_admin' ? undefined : prev.organizationName,
    }));
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, setUserRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
