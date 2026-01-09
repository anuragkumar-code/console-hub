import type { 
  User, Organization, Contact, Account, Channel, Team, 
  Ticket, Deal, Conversation, Message, Role, AuditLog 
} from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'John Mitchell',
  email: 'john@company.com',
  role: 'org_admin',
  organizationId: 'org-1',
  organizationName: 'Acme Corporation',
  createdAt: '2024-01-15'
};

export const organizations: Organization[] = [
  { id: 'org-1', name: 'Acme Corporation', plan: 'enterprise', status: 'active', userCount: 45, createdAt: '2024-01-01', industry: 'Technology' },
  { id: 'org-2', name: 'Globex Industries', plan: 'professional', status: 'active', userCount: 23, createdAt: '2024-02-15', industry: 'Manufacturing' },
  { id: 'org-3', name: 'Initech Solutions', plan: 'starter', status: 'active', userCount: 12, createdAt: '2024-03-10', industry: 'Consulting' },
  { id: 'org-4', name: 'Umbrella Corp', plan: 'enterprise', status: 'inactive', userCount: 67, createdAt: '2023-11-20', industry: 'Healthcare' },
  { id: 'org-5', name: 'Stark Industries', plan: 'professional', status: 'active', userCount: 34, createdAt: '2024-04-05', industry: 'Defense' },
  { id: 'org-6', name: 'Wayne Enterprises', plan: 'enterprise', status: 'active', userCount: 89, createdAt: '2023-08-12', industry: 'Conglomerate' },
  { id: 'org-7', name: 'Cyberdyne Systems', plan: 'starter', status: 'suspended', userCount: 8, createdAt: '2024-05-01', industry: 'AI' },
  { id: 'org-8', name: 'Oscorp', plan: 'professional', status: 'active', userCount: 56, createdAt: '2024-01-28', industry: 'Biotechnology' },
];

export const contacts: Contact[] = [
  { id: 'c-1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0101', company: 'TechStart Inc', owner: 'John Mitchell', tags: ['VIP', 'Enterprise'], status: 'active', createdAt: '2024-06-01' },
  { id: 'c-2', name: 'Michael Chen', email: 'mchen@corp.com', phone: '+1-555-0102', company: 'DataFlow LLC', owner: 'Jane Smith', tags: ['Lead'], status: 'lead', createdAt: '2024-06-05' },
  { id: 'c-3', name: 'Emily Davis', email: 'emily.d@startup.io', phone: '+1-555-0103', company: 'CloudNine', owner: 'John Mitchell', tags: ['Partner'], status: 'active', createdAt: '2024-05-20' },
  { id: 'c-4', name: 'Robert Wilson', email: 'rwilson@enterprise.com', phone: '+1-555-0104', company: 'Enterprise Co', owner: 'Mike Brown', tags: ['Enterprise', 'Priority'], status: 'active', createdAt: '2024-04-15' },
  { id: 'c-5', name: 'Lisa Anderson', email: 'lisa@agency.com', phone: '+1-555-0105', company: 'Creative Agency', owner: 'Jane Smith', tags: ['SMB'], status: 'inactive', createdAt: '2024-03-10' },
  { id: 'c-6', name: 'David Thompson', email: 'david.t@bigcorp.com', phone: '+1-555-0106', company: 'BigCorp International', owner: 'John Mitchell', tags: ['VIP'], status: 'active', createdAt: '2024-06-10' },
];

export const accounts: Account[] = [
  { id: 'a-1', companyName: 'TechStart Inc', industry: 'Technology', owner: 'John Mitchell', status: 'active', contactCount: 5, dealValue: 150000, createdAt: '2024-01-15' },
  { id: 'a-2', companyName: 'DataFlow LLC', industry: 'Data Analytics', owner: 'Jane Smith', status: 'active', contactCount: 3, dealValue: 75000, createdAt: '2024-02-20' },
  { id: 'a-3', companyName: 'CloudNine', industry: 'Cloud Services', owner: 'John Mitchell', status: 'prospect', contactCount: 2, dealValue: 0, createdAt: '2024-03-25' },
  { id: 'a-4', companyName: 'Enterprise Co', industry: 'Enterprise Software', owner: 'Mike Brown', status: 'active', contactCount: 8, dealValue: 500000, createdAt: '2023-12-01' },
  { id: 'a-5', companyName: 'Creative Agency', industry: 'Marketing', owner: 'Jane Smith', status: 'inactive', contactCount: 4, dealValue: 25000, createdAt: '2024-04-10' },
  { id: 'a-6', companyName: 'FinTech Solutions', industry: 'Financial Services', owner: 'John Mitchell', status: 'active', contactCount: 6, dealValue: 320000, createdAt: '2024-05-05' },
];

export const channels: Channel[] = [
  { id: 'ch-1', name: 'Support WhatsApp', type: 'whatsapp', status: 'active', assignedTeam: 'Support Team', createdAt: '2024-01-10' },
  { id: 'ch-2', name: 'Sales Email', type: 'email', status: 'active', assignedTeam: 'Sales Team', createdAt: '2024-01-15' },
  { id: 'ch-3', name: 'Website Chat', type: 'web_chat', status: 'active', assignedTeam: 'Support Team', createdAt: '2024-02-01' },
  { id: 'ch-4', name: 'SMS Notifications', type: 'sms', status: 'not_verified', createdAt: '2024-03-20' },
  { id: 'ch-5', name: 'Enterprise WhatsApp', type: 'whatsapp', status: 'inactive', assignedTeam: 'Enterprise Team', createdAt: '2024-04-05' },
];

export const teams: Team[] = [
  { id: 't-1', name: 'Support Team', memberCount: 8, description: 'Customer support and ticket handling', createdAt: '2024-01-01' },
  { id: 't-2', name: 'Sales Team', memberCount: 12, description: 'Sales and business development', createdAt: '2024-01-01' },
  { id: 't-3', name: 'Enterprise Team', memberCount: 5, description: 'Enterprise client management', createdAt: '2024-02-15' },
  { id: 't-4', name: 'Onboarding Team', memberCount: 4, description: 'New customer onboarding', createdAt: '2024-03-10' },
];

export const tickets: Ticket[] = [
  { id: 'tk-1', ticketNumber: 'TKT-001234', subject: 'Unable to access dashboard', status: 'open', priority: 'high', assignedTo: 'John Mitchell', slaBreached: false, createdAt: '2024-06-10T09:00:00', updatedAt: '2024-06-10T10:30:00' },
  { id: 'tk-2', ticketNumber: 'TKT-001235', subject: 'Integration not syncing data', status: 'pending', priority: 'medium', assignedTo: 'Jane Smith', slaBreached: true, createdAt: '2024-06-09T14:00:00', updatedAt: '2024-06-10T08:00:00' },
  { id: 'tk-3', ticketNumber: 'TKT-001236', subject: 'Request for bulk export feature', status: 'open', priority: 'low', assignedTo: 'Mike Brown', slaBreached: false, createdAt: '2024-06-10T11:00:00', updatedAt: '2024-06-10T11:00:00' },
  { id: 'tk-4', ticketNumber: 'TKT-001237', subject: 'Billing discrepancy for June', status: 'resolved', priority: 'high', assignedTo: 'John Mitchell', slaBreached: false, createdAt: '2024-06-08T16:00:00', updatedAt: '2024-06-09T12:00:00' },
  { id: 'tk-5', ticketNumber: 'TKT-001238', subject: 'API rate limit exceeded', status: 'open', priority: 'urgent', assignedTo: 'Jane Smith', slaBreached: true, createdAt: '2024-06-10T07:00:00', updatedAt: '2024-06-10T09:00:00' },
  { id: 'tk-6', ticketNumber: 'TKT-001239', subject: 'Password reset not working', status: 'closed', priority: 'medium', assignedTo: 'Mike Brown', slaBreached: false, createdAt: '2024-06-07T10:00:00', updatedAt: '2024-06-07T15:00:00' },
];

export const deals: Deal[] = [
  { id: 'd-1', title: 'Enterprise License - TechStart', value: 150000, stage: 'negotiation', owner: 'John Mitchell', account: 'TechStart Inc', probability: 75, expectedCloseDate: '2024-07-15', createdAt: '2024-04-01' },
  { id: 'd-2', title: 'Annual Subscription - DataFlow', value: 45000, stage: 'proposal', owner: 'Jane Smith', account: 'DataFlow LLC', probability: 50, expectedCloseDate: '2024-07-30', createdAt: '2024-05-10' },
  { id: 'd-3', title: 'Pilot Program - CloudNine', value: 15000, stage: 'qualified', owner: 'John Mitchell', account: 'CloudNine', probability: 30, expectedCloseDate: '2024-08-15', createdAt: '2024-06-01' },
  { id: 'd-4', title: 'Enterprise Renewal - EnterpriseCo', value: 500000, stage: 'closed_won', owner: 'Mike Brown', account: 'Enterprise Co', probability: 100, expectedCloseDate: '2024-06-01', createdAt: '2024-03-15' },
];

export const conversations: Conversation[] = [
  { id: 'conv-1', contactName: 'Sarah Johnson', channel: 'whatsapp', lastMessage: 'Thanks for the quick response!', lastMessageAt: '2024-06-10T10:30:00', unreadCount: 0, status: 'resolved' },
  { id: 'conv-2', contactName: 'Michael Chen', channel: 'email', lastMessage: 'Can you send me the proposal?', lastMessageAt: '2024-06-10T09:45:00', unreadCount: 2, status: 'open' },
  { id: 'conv-3', contactName: 'Emily Davis', channel: 'web_chat', lastMessage: 'I need help with the integration', lastMessageAt: '2024-06-10T11:00:00', unreadCount: 1, status: 'pending' },
  { id: 'conv-4', contactName: 'Robert Wilson', channel: 'whatsapp', lastMessage: 'Looking forward to the demo', lastMessageAt: '2024-06-09T16:00:00', unreadCount: 0, status: 'open' },
  { id: 'conv-5', contactName: 'Lisa Anderson', channel: 'email', lastMessage: 'Please review the attached document', lastMessageAt: '2024-06-09T14:30:00', unreadCount: 3, status: 'open' },
];

export const messages: Message[] = [
  { id: 'm-1', content: 'Hi, I need help with accessing my dashboard', sender: 'customer', senderName: 'Michael Chen', timestamp: '2024-06-10T09:00:00' },
  { id: 'm-2', content: 'Hello Michael! I\'d be happy to help. Can you tell me what error you\'re seeing?', sender: 'agent', senderName: 'John Mitchell', timestamp: '2024-06-10T09:05:00' },
  { id: 'm-3', content: 'It says "Access Denied" when I try to log in', sender: 'customer', senderName: 'Michael Chen', timestamp: '2024-06-10T09:10:00' },
  { id: 'm-4', content: 'Customer has 2FA enabled, checking if there\'s an issue with their token', sender: 'agent', senderName: 'John Mitchell', timestamp: '2024-06-10T09:15:00', isInternalNote: true },
  { id: 'm-5', content: 'I\'ve reset your 2FA settings. Please try logging in again and set up a new authenticator.', sender: 'agent', senderName: 'John Mitchell', timestamp: '2024-06-10T09:20:00' },
  { id: 'm-6', content: 'That worked! Thank you so much!', sender: 'customer', senderName: 'Michael Chen', timestamp: '2024-06-10T09:30:00' },
  { id: 'm-7', content: 'Can you send me the proposal?', sender: 'customer', senderName: 'Michael Chen', timestamp: '2024-06-10T09:45:00' },
];

export const roles: Role[] = [
  {
    id: 'r-1',
    name: 'Administrator',
    description: 'Full access to all organization features',
    permissions: [
      { module: 'Contacts', read: true, create: true, update: true, delete: true },
      { module: 'Accounts', read: true, create: true, update: true, delete: true },
      { module: 'Deals', read: true, create: true, update: true, delete: true },
      { module: 'Tickets', read: true, create: true, update: true, delete: true },
      { module: 'Channels', read: true, create: true, update: true, delete: true },
      { module: 'Teams', read: true, create: true, update: true, delete: true },
      { module: 'Settings', read: true, create: true, update: true, delete: true },
    ]
  },
  {
    id: 'r-2',
    name: 'Agent',
    description: 'Access to assigned contacts, tickets, and inbox',
    permissions: [
      { module: 'Contacts', read: true, create: true, update: true, delete: false },
      { module: 'Accounts', read: true, create: false, update: false, delete: false },
      { module: 'Deals', read: true, create: true, update: true, delete: false },
      { module: 'Tickets', read: true, create: true, update: true, delete: false },
      { module: 'Channels', read: true, create: false, update: false, delete: false },
      { module: 'Teams', read: true, create: false, update: false, delete: false },
      { module: 'Settings', read: false, create: false, update: false, delete: false },
    ]
  },
];

export const auditLogs: AuditLog[] = [
  { id: 'log-1', action: 'User Created', user: 'John Mitchell', resource: 'Users', details: 'Created user jane.smith@company.com', timestamp: '2024-06-10T10:30:00', ipAddress: '192.168.1.100' },
  { id: 'log-2', action: 'Role Updated', user: 'Admin System', resource: 'Roles', details: 'Updated permissions for Agent role', timestamp: '2024-06-10T09:15:00', ipAddress: '192.168.1.1' },
  { id: 'log-3', action: 'Organization Created', user: 'System', resource: 'Organizations', details: 'Created organization Stark Industries', timestamp: '2024-06-09T16:00:00', ipAddress: '10.0.0.1' },
  { id: 'log-4', action: 'Channel Activated', user: 'John Mitchell', resource: 'Channels', details: 'Activated WhatsApp channel for Support', timestamp: '2024-06-09T14:30:00', ipAddress: '192.168.1.100' },
  { id: 'log-5', action: 'User Deactivated', user: 'Jane Smith', resource: 'Users', details: 'Deactivated user mike.old@company.com', timestamp: '2024-06-08T11:00:00', ipAddress: '192.168.1.105' },
];

export const users: User[] = [
  { id: 'u-1', name: 'John Mitchell', email: 'john@company.com', role: 'org_admin', organizationId: 'org-1', organizationName: 'Acme Corporation', createdAt: '2024-01-15' },
  { id: 'u-2', name: 'Jane Smith', email: 'jane@company.com', role: 'agent', organizationId: 'org-1', organizationName: 'Acme Corporation', createdAt: '2024-02-01' },
  { id: 'u-3', name: 'Mike Brown', email: 'mike@company.com', role: 'agent', organizationId: 'org-1', organizationName: 'Acme Corporation', createdAt: '2024-02-15' },
  { id: 'u-4', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'agent', organizationId: 'org-1', organizationName: 'Acme Corporation', createdAt: '2024-03-01' },
  { id: 'u-5', name: 'Tom Davis', email: 'tom@globex.com', role: 'org_admin', organizationId: 'org-2', organizationName: 'Globex Industries', createdAt: '2024-02-15' },
];
