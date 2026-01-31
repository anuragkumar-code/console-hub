// ============================================
// Conversation & Message Types
// ============================================

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type ConversationChannel = 'email' | 'whatsapp' | 'sms' | 'chat' | 'social' | 'phone';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'template' | 'system';

/**
 * Conversation participant
 */
export interface ConversationParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  type: 'contact' | 'agent' | 'system';
}

/**
 * Conversation from API response
 */
export interface Conversation {
  id: string;
  organization_id: string;
  channel_id: string;
  channel_type: ConversationChannel;
  channel_name?: string;
  // Contact info
  contact_id?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_avatar?: string;
  // Assignment
  assignee_id?: string;
  assignee_name?: string;
  team_id?: string;
  team_name?: string;
  // Status
  status: ConversationStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  // Last message preview
  last_message?: string;
  last_message_at?: string;
  last_message_direction?: MessageDirection;
  // Metadata
  unread_count: number;
  message_count: number;
  subject?: string;
  tags?: string[];
  // Timestamps
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  closed_at?: string;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  name: string;
  url: string;
  size?: number;
  mime_type?: string;
}

/**
 * Message from API response
 */
export interface Message {
  id: string;
  conversation_id: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string;
  sender_type: 'contact' | 'agent' | 'system';
  direction: MessageDirection;
  type: MessageType;
  content: string;
  html_content?: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  metadata?: Record<string, unknown>;
  created_at: string;
  delivered_at?: string;
  read_at?: string;
}

/**
 * Create conversation request
 */
export interface CreateConversationRequest {
  channel_id: string;
  contact_id?: string;
  contact_email?: string;
  contact_phone?: string;
  subject?: string;
  initial_message?: string;
  assignee_id?: string;
  team_id?: string;
  tags?: string[];
}

/**
 * Update conversation request
 */
export interface UpdateConversationRequest {
  status?: ConversationStatus;
  assignee_id?: string | null;
  team_id?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  content: string;
  type?: MessageType;
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'file' | 'audio' | 'video';
  }[];
}

/**
 * Conversation list query params
 */
export interface ConversationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConversationStatus | ConversationStatus[];
  channel_id?: string;
  channel_type?: ConversationChannel;
  assignee_id?: string;
  team_id?: string;
  contact_id?: string;
  unread_only?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Message list query params
 */
export interface MessageListParams {
  page?: number;
  limit?: number;
  before?: string;
  after?: string;
}

/**
 * Conversation statistics
 */
export interface ConversationStats {
  total_conversations: number;
  open_conversations: number;
  pending_conversations: number;
  unread_conversations: number;
  avg_response_time: number;
  avg_resolution_time: number;
  conversations_by_channel: Record<ConversationChannel, number>;
  conversations_by_status: Record<ConversationStatus, number>;
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
