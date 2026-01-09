// User Roles
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

export interface Permission {
  module: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
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
export interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
}
