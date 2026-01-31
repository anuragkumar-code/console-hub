// ============================================
// Dashboard Stats Types
// ============================================

/**
 * Platform-wide statistics (for God Admin)
 */
export interface PlatformStats {
  // Organizations
  total_organizations: number;
  active_organizations: number;
  organizations_this_month: number;
  organizations_growth: number;
  // Users
  total_users: number;
  active_users: number;
  users_this_month: number;
  users_growth: number;
  // Revenue (if applicable)
  total_revenue?: number;
  revenue_this_month?: number;
  revenue_growth?: number;
  // System health
  api_uptime: number;
  avg_response_time: number;
  error_rate: number;
}

/**
 * Organization-level statistics
 */
export interface OrganizationDashboardStats {
  // Contacts & Accounts
  total_contacts: number;
  contacts_this_month: number;
  contacts_growth: number;
  total_accounts: number;
  accounts_this_month: number;
  // Deals
  total_deals: number;
  deals_value: number;
  deals_won: number;
  deals_won_value: number;
  deals_lost: number;
  conversion_rate: number;
  // Tickets
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  avg_resolution_time: number;
  sla_compliance: number;
  // Conversations
  total_conversations: number;
  active_conversations: number;
  avg_response_time: number;
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  date: string;
  value: number;
}

/**
 * Chart data for dashboard widgets
 */
export interface DashboardChartData {
  deals_by_stage: Array<{ stage: string; count: number; value: number }>;
  deals_over_time: TimeSeriesPoint[];
  tickets_by_status: Array<{ status: string; count: number }>;
  tickets_over_time: TimeSeriesPoint[];
  conversations_by_channel: Array<{ channel: string; count: number }>;
  revenue_over_time?: TimeSeriesPoint[];
}

/**
 * Recent activity item
 */
export interface ActivityItem {
  id: string;
  type: 'deal' | 'ticket' | 'contact' | 'conversation' | 'user' | 'organization';
  action: 'created' | 'updated' | 'deleted' | 'resolved' | 'closed' | 'won' | 'lost';
  title: string;
  description?: string;
  user_name?: string;
  user_avatar?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * Dashboard overview response
 */
export interface DashboardOverview {
  stats: OrganizationDashboardStats;
  charts: DashboardChartData;
  recent_activity: ActivityItem[];
}

/**
 * Platform overview response (for God Admin)
 */
export interface PlatformOverview {
  stats: PlatformStats;
  organizations_by_plan: Array<{ plan: string; count: number }>;
  users_by_role: Array<{ role: string; count: number }>;
  recent_organizations: Array<{
    id: string;
    name: string;
    plan_type: string;
    created_at: string;
  }>;
  recent_activity: ActivityItem[];
}

/**
 * Dashboard query params
 */
export interface DashboardParams {
  date_from?: string;
  date_to?: string;
  organization_id?: string;
}
