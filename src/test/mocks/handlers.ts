import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Mock data
export const mockUser = {
  id: 'user-1',
  email: 'admin@acme.com',
  first_name: 'John',
  last_name: 'Doe',
  status: 'active',
  organization_id: 'org-1',
  organization: {
    id: 'org-1',
    name: 'Acme Corp',
    slug: 'acme-corp',
  },
  role: {
    id: 'role-1',
    name: 'Organization Admin',
    slug: 'org_admin',
    permissions: [
      { id: 'p1', slug: 'users.view', name: 'View Users' },
      { id: 'p2', slug: 'users.create', name: 'Create Users' },
      { id: 'p3', slug: 'users.update', name: 'Update Users' },
      { id: 'p4', slug: 'contacts.view', name: 'View Contacts' },
      { id: 'p5', slug: 'settings.update', name: 'Update Settings' },
    ],
  },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

export const mockOrganizations = [
  {
    id: 'org-1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    plan_type: 'enterprise',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Tech Startup',
    slug: 'tech-startup',
    plan_type: 'professional',
    status: 'active',
    created_at: '2024-02-15T00:00:00Z',
  },
];

export const mockContacts = [
  {
    id: 'contact-1',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: '+1234567890',
    status: 'active',
    account_id: 'account-1',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'contact-2',
    first_name: 'Bob',
    last_name: 'Johnson',
    email: 'bob@example.com',
    status: 'active',
    created_at: '2024-01-20T00:00:00Z',
  },
];

export const mockDashboardStats = {
  total_contacts: 156,
  contacts_this_month: 12,
  contacts_growth: 8,
  total_accounts: 24,
  accounts_this_month: 3,
  total_deals: 45,
  deals_value: 685000,
  deals_won: 15,
  deals_won_value: 250000,
  deals_lost: 5,
  conversion_rate: 33,
  total_tickets: 89,
  open_tickets: 12,
  resolved_tickets: 77,
  avg_resolution_time: 4.5,
  sla_compliance: 94,
  total_conversations: 234,
  active_conversations: 18,
  avg_response_time: 2.3,
};

// API Handlers
export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { identifier: string; password: string };
    
    if (body.identifier === 'admin@acme.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expires_in: 3600,
          user: mockUser,
        },
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ success: true, message: 'Logged out successfully' });
  }),

  http.post(`${API_BASE_URL}/auth/refresh-token`, async ({ request }) => {
    const body = await request.json() as { refreshToken: string };
    
    if (body.refreshToken) {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid refresh token' },
      { status: 401 }
    );
  }),

  http.get(`${API_BASE_URL}/auth/profile`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return HttpResponse.json({ success: true, data: { user: mockUser } });
  }),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return HttpResponse.json({ success: true, data: mockUser });
  }),

  // Organizations endpoints
  http.get(`${API_BASE_URL}/organizations`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: mockOrganizations,
        total: mockOrganizations.length,
        page: 1,
        limit: 10,
        total_pages: 1,
      },
    });
  }),

  http.get(`${API_BASE_URL}/organizations/:id`, ({ params }) => {
    const org = mockOrganizations.find((o) => o.id === params.id);
    if (!org) {
      return HttpResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: org });
  }),

  http.post(`${API_BASE_URL}/organizations`, async ({ request }) => {
    const body = await request.json() as { name: string; slug: string };
    const newOrg = {
      id: `org-${Date.now()}`,
      ...body,
      plan_type: 'starter',
      status: 'active',
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newOrg }, { status: 201 });
  }),

  // Contacts endpoints
  http.get(`${API_BASE_URL}/contacts`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: mockContacts,
        total: mockContacts.length,
        page: 1,
        limit: 10,
        total_pages: 1,
      },
    });
  }),

  http.get(`${API_BASE_URL}/contacts/:id`, ({ params }) => {
    const contact = mockContacts.find((c) => c.id === params.id);
    if (!contact) {
      return HttpResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: contact });
  }),

  // Dashboard endpoints
  http.get(`${API_BASE_URL}/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        stats: mockDashboardStats,
        charts: {
          deals_by_stage: [
            { stage: 'lead', count: 15, value: 150000 },
            { stage: 'qualified', count: 10, value: 200000 },
            { stage: 'proposal', count: 8, value: 180000 },
            { stage: 'negotiation', count: 5, value: 100000 },
          ],
          deals_over_time: [],
          tickets_by_status: [
            { status: 'open', count: 12 },
            { status: 'in_progress', count: 8 },
            { status: 'resolved', count: 77 },
          ],
          tickets_over_time: [],
          conversations_by_channel: [
            { channel: 'email', count: 120 },
            { channel: 'whatsapp', count: 80 },
            { channel: 'chat', count: 34 },
          ],
        },
        recent_activity: [
          {
            id: 'act-1',
            type: 'deal',
            action: 'won',
            title: 'Deal Won',
            description: 'Enterprise License - TechStart',
            created_at: new Date().toISOString(),
          },
          {
            id: 'act-2',
            type: 'ticket',
            action: 'resolved',
            title: 'Ticket Resolved',
            description: 'API rate limit issue fixed',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      },
    });
  }),

  http.get(`${API_BASE_URL}/dashboard/platform`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        stats: {
          total_organizations: 8,
          active_organizations: 7,
          organizations_this_month: 2,
          organizations_growth: 15,
          total_users: 234,
          active_users: 180,
          users_this_month: 12,
          users_growth: 8,
          api_uptime: 99.9,
          avg_response_time: 150,
          error_rate: 0.1,
        },
        organizations_by_plan: [
          { plan: 'starter', count: 3 },
          { plan: 'professional', count: 3 },
          { plan: 'enterprise', count: 2 },
        ],
        users_by_role: [
          { role: 'admin', count: 8 },
          { role: 'agent', count: 180 },
          { role: 'viewer', count: 46 },
        ],
        recent_organizations: mockOrganizations,
        recent_activity: [
          {
            id: 'act-1',
            type: 'organization',
            action: 'created',
            title: 'New organization created',
            description: 'Stark Industries',
            created_at: new Date().toISOString(),
          },
        ],
      },
    });
  }),

  http.get(`${API_BASE_URL}/dashboard/activity`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'act-1',
          type: 'deal',
          action: 'won',
          title: 'Deal Won',
          description: 'Enterprise License - TechStart',
          created_at: new Date().toISOString(),
        },
        {
          id: 'act-2',
          type: 'ticket',
          action: 'resolved',
          title: 'Ticket Resolved',
          description: 'API rate limit issue fixed',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    });
  }),

  // Settings endpoints
  http.get(`${API_BASE_URL}/settings`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        general: {
          name: 'Acme Corp',
          slug: 'acme-corp',
          email: 'contact@acme.com',
          timezone: 'America/New_York',
          date_format: 'MM/DD/YYYY',
          currency: 'USD',
          language: 'en',
        },
        notifications: {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          notify_new_ticket: true,
          notify_ticket_assigned: true,
          notify_ticket_resolved: true,
          notify_new_deal: true,
          notify_deal_won: true,
          notify_deal_lost: false,
          notify_new_conversation: true,
          notify_mention: true,
          daily_digest: false,
          weekly_report: true,
        },
        security: {
          two_factor_enabled: false,
          session_timeout: 60,
          password_expiry_days: 90,
          require_strong_password: true,
          login_attempts_limit: 5,
          lockout_duration: 15,
        },
        branding: {
          primary_color: '#3b82f6',
          secondary_color: '#64748b',
        },
        integrations: {
          api_enabled: true,
          webhook_enabled: true,
        },
      },
    });
  }),

  // Profile endpoints
  http.get(`${API_BASE_URL}/profile`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@acme.com',
        phone: '+1234567890',
        avatar_url: null,
        timezone: 'America/New_York',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    });
  }),

  http.put(`${API_BASE_URL}/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@acme.com',
        ...body,
      },
    });
  }),

  // Audit logs endpoints
  http.get(`${API_BASE_URL}/audit-logs`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            id: 'log-1',
            user_id: 'user-1',
            user_name: 'John Doe',
            user_email: 'admin@acme.com',
            action: 'login',
            resource: 'user',
            description: 'User logged in',
            ip_address: '192.168.1.1',
            created_at: new Date().toISOString(),
          },
          {
            id: 'log-2',
            user_id: 'user-1',
            user_name: 'John Doe',
            user_email: 'admin@acme.com',
            action: 'create',
            resource: 'contact',
            resource_name: 'Jane Smith',
            description: 'Created new contact',
            ip_address: '192.168.1.1',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        total_pages: 1,
      },
    });
  }),

  // API Keys endpoints
  http.get(`${API_BASE_URL}/settings/api-keys`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'key-1',
          name: 'Production API Key',
          key_prefix: 'sk_prod_abc',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          last_used_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'key-2',
          name: 'Development API Key',
          key_prefix: 'sk_dev_xyz',
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ],
    });
  }),

  http.post(`${API_BASE_URL}/settings/api-keys`, async ({ request }) => {
    const body = await request.json() as { name: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: `key-${Date.now()}`,
        name: body.name,
        key: 'sk_live_' + Math.random().toString(36).substring(2, 38),
        key_prefix: 'sk_live_' + Math.random().toString(36).substring(2, 10),
        created_at: new Date().toISOString(),
      },
    }, { status: 201 });
  }),

  http.delete(`${API_BASE_URL}/settings/api-keys/:id`, () => {
    return HttpResponse.json({ success: true, message: 'API key deleted' });
  }),

  // Webhooks endpoints
  http.get(`${API_BASE_URL}/settings/webhooks`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'webhook-1',
          url: 'https://example.com/webhook',
          events: ['contact.created', 'contact.updated', 'deal.won'],
          is_active: true,
        },
        {
          id: 'webhook-2',
          url: 'https://api.slack.com/webhook/123',
          events: ['ticket.created', 'ticket.resolved'],
          is_active: false,
        },
      ],
    });
  }),

  http.post(`${API_BASE_URL}/settings/webhooks`, async ({ request }) => {
    const body = await request.json() as { url: string; events: string[] };
    return HttpResponse.json({
      success: true,
      data: {
        id: `webhook-${Date.now()}`,
        secret: 'whsec_' + Math.random().toString(36).substring(2, 34),
      },
    }, { status: 201 });
  }),

  http.delete(`${API_BASE_URL}/settings/webhooks/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Webhook deleted' });
  }),

  http.post(`${API_BASE_URL}/settings/webhooks/:id/test`, () => {
    return HttpResponse.json({
      success: true,
      data: { success: true, message: 'Webhook test successful' },
    });
  }),
];
