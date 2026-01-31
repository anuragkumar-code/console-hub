// ============================================
// RBAC Types - Role-Based Access Control
// ============================================

// Permission action types
export type PermissionAction = 'read' | 'create' | 'update' | 'delete';

// Permission from API response
export interface Permission {
  id: string;
  resource: string;
  action: PermissionAction;
  name?: string;
  description?: string;
  module?: string;
}

// Role from API response
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_system: boolean;
  organization_id: string | null;
  permissions: Permission[];
}

// Authenticated user from login response
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  organizationId?: string;
  organizationName?: string;
  isGodAdmin: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

// Login API response structure
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
    refreshToken?: string;
  };
}

// Legacy User type - keeping for backward compatibility with existing components
// TODO: Gradually migrate components to use AuthUser
export type UserRole = 'god_admin' | 'org_admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organizationName?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  userCount: number;
  createdAt: string;
  industry?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  owner: string;
  tags: string[];
  status: 'active' | 'inactive' | 'lead';
  createdAt: string;
}

export interface Account {
  id: string;
  companyName: string;
  industry: string;
  owner: string;
  status: 'active' | 'inactive' | 'prospect';
  contactCount: number;
  dealValue: number;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms' | 'web_chat';
  status: 'active' | 'inactive' | 'not_verified';
  assignedTeam?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  description?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  owner: string;
  account?: string;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactAvatar?: string;
  channel: 'whatsapp' | 'email' | 'web_chat';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'open' | 'pending' | 'resolved';
}

export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  senderName: string;
  timestamp: string;
  isInternalNote?: boolean;
}

// Legacy permission structure for display (keeping for backward compatibility)
export interface ModulePermission {
  module: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

// Mock data permission type (for mockData.ts compatibility)
export interface MockPermission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: PermissionAction;
  description: string;
  module: string;
  is_system: boolean;
}

// Mock data role type (for mockData.ts compatibility)
export interface MockRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  organization_id: string | null;
  permissions: string[]; // array of permission slugs
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Navigation types
export interface NavItemPermission {
  resource: string;
  action: PermissionAction;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  permission?: NavItemPermission; // Permission required to see this nav item
  alwaysVisible?: boolean; // For items like Profile that are always visible
}

// Legacy NavItem with roles (for backward compatibility during migration)
export interface LegacyNavItem {
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
}
