import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  KeyRound,
  MessageSquare,
  Contact,
  Briefcase,
  HandshakeIcon,
  Ticket,
  Inbox,
  UsersRound,
  Settings,
  User,
  FileText,
  Key,
  Webhook,
} from 'lucide-react';
import type { PermissionAction } from '@/types';

// ============================================
// Route Permission Configuration
// ============================================

export interface RoutePermission {
  resource: string;
  action: PermissionAction;
}

/**
 * Maps routes to their required permissions
 * If a route is not listed here, it's considered public or always accessible
 */
export const routePermissions: Record<string, RoutePermission> = {
  // Dashboard - accessible to all authenticated users
  '/dashboard': { resource: 'dashboard', action: 'read' },
  
  // Platform Admin (God Admin only)
  '/organizations': { resource: 'organizations', action: 'read' },
  '/audit-logs': { resource: 'audit_logs', action: 'read' },
  
  // Admin Module
  '/users': { resource: 'users', action: 'read' },
  '/roles': { resource: 'roles', action: 'read' },
  '/permissions': { resource: 'permissions', action: 'read' },
  '/teams': { resource: 'teams', action: 'read' },
  
  // CRM Module
  '/contacts': { resource: 'contacts', action: 'read' },
  '/accounts': { resource: 'accounts', action: 'read' },
  
  // Sales Module
  '/deals': { resource: 'deals', action: 'read' },
  
  // Support Module
  '/tickets': { resource: 'tickets', action: 'read' },
  
  // Communication Module
  '/inbox': { resource: 'conversations', action: 'read' },
  '/channels': { resource: 'channels', action: 'read' },
  
  // Settings
  '/settings': { resource: 'settings', action: 'read' },
  '/settings/api-keys': { resource: 'settings', action: 'read' },
  '/settings/webhooks': { resource: 'settings', action: 'read' },
};

// Routes that are always accessible to authenticated users
export const publicRoutes = ['/profile'];

// Auth routes (no authentication required)
export const authRoutes = ['/', '/login', '/register', '/forgot-password'];

// ============================================
// Navigation Configuration
// ============================================

export interface NavItemConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  permission?: RoutePermission;
  alwaysVisible?: boolean; // For items like Profile
  godAdminOnly?: boolean; // Only visible to god admin
}

/**
 * Navigation items with their permission requirements
 * Items are filtered based on user's permissions
 */
export const navItems: NavItemConfig[] = [
  // Dashboard - visible to all authenticated users
  { 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    alwaysVisible: true,
  },
  
  // Platform Admin Section (God Admin Only)
  { 
    label: 'Organizations', 
    icon: Building2, 
    path: '/organizations',
    permission: { resource: 'organizations', action: 'read' },
    godAdminOnly: true,
  },
  { 
    label: 'Users', 
    icon: Users, 
    path: '/users',
    permission: { resource: 'users', action: 'read' },
  },
  { 
    label: 'Roles', 
    icon: Shield, 
    path: '/roles',
    permission: { resource: 'roles', action: 'read' },
  },
  { 
    label: 'Permissions', 
    icon: KeyRound, 
    path: '/permissions',
    permission: { resource: 'permissions', action: 'read' },
    godAdminOnly: true,
  },
  
  // CRM Section
  { 
    label: 'Contacts', 
    icon: Contact, 
    path: '/contacts',
    permission: { resource: 'contacts', action: 'read' },
  },
  { 
    label: 'Accounts', 
    icon: Briefcase, 
    path: '/accounts',
    permission: { resource: 'accounts', action: 'read' },
  },
  { 
    label: 'Deals', 
    icon: HandshakeIcon, 
    path: '/deals',
    permission: { resource: 'deals', action: 'read' },
  },
  
  // Support Section
  { 
    label: 'Tickets', 
    icon: Ticket, 
    path: '/tickets',
    permission: { resource: 'tickets', action: 'read' },
  },
  
  // Communication Section
  { 
    label: 'Inbox', 
    icon: Inbox, 
    path: '/inbox',
    permission: { resource: 'conversations', action: 'read' },
  },
  { 
    label: 'Channels', 
    icon: MessageSquare, 
    path: '/channels',
    permission: { resource: 'channels', action: 'read' },
  },
  
  // Team Management
  { 
    label: 'Teams', 
    icon: UsersRound, 
    path: '/teams',
    permission: { resource: 'teams', action: 'read' },
  },
  
  // Platform Admin
  { 
    label: 'Audit Logs', 
    icon: FileText, 
    path: '/audit-logs',
    permission: { resource: 'audit_logs', action: 'read' },
    godAdminOnly: true,
  },
  
  // Settings
  { 
    label: 'Settings', 
    icon: Settings, 
    path: '/settings',
    permission: { resource: 'settings', action: 'read' },
  },
  { 
    label: 'API Keys', 
    icon: Key, 
    path: '/settings/api-keys',
    permission: { resource: 'settings', action: 'read' },
  },
  { 
    label: 'Webhooks', 
    icon: Webhook, 
    path: '/settings/webhooks',
    permission: { resource: 'settings', action: 'read' },
  },
  
  // Profile - always visible
  { 
    label: 'Profile', 
    icon: User, 
    path: '/profile',
    alwaysVisible: true,
  },
];

// ============================================
// Resource Definitions
// ============================================

/**
 * All available resources in the system
 * Used for permission management and validation
 */
export const resources = [
  // Platform
  'organizations',
  'audit_logs',
  'permissions',
  
  // Admin
  'users',
  'roles',
  'teams',
  
  // CRM
  'contacts',
  'accounts',
  
  // Sales
  'deals',
  'pipelines',
  
  // Support
  'tickets',
  'sla_policies',
  
  // Communication
  'channels',
  'conversations',
  'messages',
  
  // Other
  'dashboard',
  'settings',
  'profile',
] as const;

export type Resource = typeof resources[number];

/**
 * Actions available for each resource
 */
export const actions: PermissionAction[] = ['read', 'create', 'update', 'delete'];

/**
 * Helper to create a permission string (e.g., "contacts:read")
 */
export function createPermissionString(resource: string, action: PermissionAction): string {
  return `${resource}:${action}`;
}

/**
 * Helper to parse a permission string (e.g., "contacts:read" -> { resource: "contacts", action: "read" })
 */
export function parsePermissionString(permissionString: string): RoutePermission | null {
  const [resource, action] = permissionString.split(':');
  if (resource && action && actions.includes(action as PermissionAction)) {
    return { resource, action: action as PermissionAction };
  }
  return null;
}
