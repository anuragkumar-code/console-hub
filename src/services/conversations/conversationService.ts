import api, { ApiResponse } from '@/services/api';
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  ConversationListParams,
  MessageListParams,
  ConversationStats,
  ConversationStatus,
  PaginatedResponse,
} from './types';

// ============================================
// Conversation Service
// ============================================

export const conversationService = {
  /**
   * Get all conversations (paginated)
   */
  getAll: async (params?: ConversationListParams): Promise<PaginatedResponse<Conversation>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Conversation>>>(
      '/conversations',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get conversation by ID
   */
  getById: async (id: string): Promise<Conversation> => {
    const response = await api.get<ApiResponse<Conversation>>(
      `/conversations/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new conversation
   */
  create: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await api.post<ApiResponse<Conversation>>(
      '/conversations',
      data
    );
    return response.data.data;
  },

  /**
   * Update a conversation
   */
  update: async (id: string, data: UpdateConversationRequest): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a conversation
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },

  /**
   * Update conversation status
   */
  updateStatus: async (id: string, status: ConversationStatus): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Assign conversation to user
   */
  assign: async (id: string, assigneeId: string | null): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { assignee_id: assigneeId }
    );
    return response.data.data;
  },

  /**
   * Assign conversation to team
   */
  assignToTeam: async (id: string, teamId: string | null): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { team_id: teamId }
    );
    return response.data.data;
  },

  /**
   * Resolve a conversation
   */
  resolve: async (id: string): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { status: 'resolved' }
    );
    return response.data.data;
  },

  /**
   * Close a conversation
   */
  close: async (id: string): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { status: 'closed' }
    );
    return response.data.data;
  },

  /**
   * Reopen a conversation
   */
  reopen: async (id: string): Promise<Conversation> => {
    const response = await api.put<ApiResponse<Conversation>>(
      `/conversations/${id}`,
      { status: 'open' }
    );
    return response.data.data;
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (id: string): Promise<Conversation> => {
    const response = await api.post<ApiResponse<Conversation>>(
      `/conversations/${id}/read`
    );
    return response.data.data;
  },

  /**
   * Get conversation statistics
   */
  getStats: async (params?: { assignee_id?: string; team_id?: string }): Promise<ConversationStats> => {
    const response = await api.get<ApiResponse<ConversationStats>>(
      '/conversations/stats',
      { params }
    );
    return response.data.data;
  },

  // ============================================
  // Message Operations
  // ============================================

  /**
   * Get messages for a conversation
   */
  getMessages: async (conversationId: string, params?: MessageListParams): Promise<PaginatedResponse<Message>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Message>>>(
      `/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (conversationId: string, data: SendMessageRequest): Promise<Message> => {
    const response = await api.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a message
   */
  deleteMessage: async (conversationId: string, messageId: string): Promise<void> => {
    await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
  },
};

export default conversationService;
