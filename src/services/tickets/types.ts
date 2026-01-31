// ============================================
// Ticket Types
// ============================================

export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketType = 'question' | 'incident' | 'problem' | 'feature_request' | 'task';
export type TicketChannel = 'email' | 'phone' | 'chat' | 'web' | 'social' | 'api';

/**
 * Ticket SLA information
 */
export interface TicketSLA {
  first_response_due?: string;
  first_response_at?: string;
  resolution_due?: string;
  resolved_at?: string;
  is_first_response_breached?: boolean;
  is_resolution_breached?: boolean;
}

/**
 * Ticket custom fields stored as JSONB
 */
export interface TicketCustomFields {
  [key: string]: string | number | boolean | null;
}

/**
 * Ticket comment/reply
 */
export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  is_internal: boolean;
  attachments?: string[];
  created_at: string;
}

/**
 * Ticket from API response
 */
export interface Ticket {
  id: string;
  organization_id: string;
  ticket_number: string;
  subject: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type?: TicketType;
  channel?: TicketChannel;
  // Associations
  contact_id?: string;
  contact_name?: string;
  contact_email?: string;
  account_id?: string;
  account_name?: string;
  assignee_id?: string;
  assignee_name?: string;
  team_id?: string;
  team_name?: string;
  // SLA
  sla?: TicketSLA;
  // Additional fields
  tags?: string[];
  category?: string;
  subcategory?: string;
  custom_fields?: TicketCustomFields;
  attachments?: string[];
  // Metadata
  created_at: string;
  updated_at?: string;
  created_by?: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
}

/**
 * Create ticket request
 */
export interface CreateTicketRequest {
  subject: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  channel?: TicketChannel;
  contact_id?: string;
  account_id?: string;
  assignee_id?: string;
  team_id?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
  custom_fields?: TicketCustomFields;
}

/**
 * Update ticket request
 */
export interface UpdateTicketRequest extends Partial<CreateTicketRequest> {
  status?: TicketStatus;
}

/**
 * Add comment request
 */
export interface AddCommentRequest {
  content: string;
  is_internal?: boolean;
  attachments?: string[];
}

/**
 * Ticket list query params
 */
export interface TicketListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority;
  type?: TicketType;
  channel?: TicketChannel;
  contact_id?: string;
  account_id?: string;
  assignee_id?: string;
  team_id?: string;
  category?: string;
  tags?: string[];
  created_from?: string;
  created_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Ticket statistics
 */
export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  avg_first_response_time: number;
  avg_resolution_time: number;
  sla_compliance_rate: number;
  tickets_by_priority: Record<TicketPriority, number>;
  tickets_by_channel: Record<TicketChannel, number>;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
