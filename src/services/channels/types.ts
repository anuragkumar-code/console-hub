// ============================================
// Channel Types
// ============================================

export type ChannelType = 'email' | 'whatsapp' | 'sms' | 'chat' | 'facebook' | 'instagram' | 'twitter' | 'api';
export type ChannelStatus = 'active' | 'inactive' | 'pending' | 'error';

/**
 * Channel configuration based on type
 */
export interface EmailChannelConfig {
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  imap_host?: string;
  imap_port?: number;
  from_email?: string;
  from_name?: string;
}

export interface WhatsAppChannelConfig {
  phone_number_id?: string;
  waba_id?: string;
  access_token?: string;
  webhook_verify_token?: string;
}

export interface ChatChannelConfig {
  widget_color?: string;
  widget_position?: 'left' | 'right';
  welcome_message?: string;
  offline_message?: string;
  auto_reply?: boolean;
}

export type ChannelConfig = EmailChannelConfig | WhatsAppChannelConfig | ChatChannelConfig | Record<string, unknown>;

/**
 * Channel from API response
 */
export interface Channel {
  id: string;
  organization_id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  description?: string;
  // Type-specific config
  config?: ChannelConfig;
  // Settings
  is_default?: boolean;
  auto_assign?: boolean;
  default_team_id?: string;
  default_team_name?: string;
  // Stats
  conversation_count?: number;
  message_count?: number;
  // Timestamps
  last_activity_at?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create channel request
 */
export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  description?: string;
  config?: ChannelConfig;
  is_default?: boolean;
  auto_assign?: boolean;
  default_team_id?: string;
}

/**
 * Update channel request
 */
export interface UpdateChannelRequest {
  name?: string;
  description?: string;
  status?: ChannelStatus;
  config?: ChannelConfig;
  is_default?: boolean;
  auto_assign?: boolean;
  default_team_id?: string;
}

/**
 * Channel list query params
 */
export interface ChannelListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ChannelType;
  status?: ChannelStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Channel statistics
 */
export interface ChannelStats {
  total_conversations: number;
  active_conversations: number;
  total_messages: number;
  messages_today: number;
  avg_response_time: number;
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
