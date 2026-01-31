import api, { ApiResponse } from '@/services/api';
import type {
  Ticket,
  TicketComment,
  CreateTicketRequest,
  UpdateTicketRequest,
  AddCommentRequest,
  TicketListParams,
  TicketStats,
  TicketStatus,
  PaginatedResponse,
} from './types';

// ============================================
// Ticket Service
// ============================================

export const ticketService = {
  /**
   * Get all tickets (paginated)
   */
  getAll: async (params?: TicketListParams): Promise<PaginatedResponse<Ticket>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Ticket>>>(
      '/tickets',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get ticket by ID
   */
  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get<ApiResponse<Ticket>>(
      `/tickets/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new ticket
   */
  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post<ApiResponse<Ticket>>(
      '/tickets',
      data
    );
    return response.data.data;
  },

  /**
   * Update a ticket
   */
  update: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a ticket
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  /**
   * Update ticket status
   */
  updateStatus: async (id: string, status: TicketStatus): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Assign ticket to user
   */
  assign: async (id: string, assigneeId: string): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { assignee_id: assigneeId }
    );
    return response.data.data;
  },

  /**
   * Assign ticket to team
   */
  assignToTeam: async (id: string, teamId: string): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { team_id: teamId }
    );
    return response.data.data;
  },

  /**
   * Get ticket comments
   */
  getComments: async (id: string): Promise<TicketComment[]> => {
    const response = await api.get<ApiResponse<TicketComment[]>>(
      `/tickets/${id}/comments`
    );
    return response.data.data;
  },

  /**
   * Add comment to ticket
   */
  addComment: async (id: string, data: AddCommentRequest): Promise<TicketComment> => {
    const response = await api.post<ApiResponse<TicketComment>>(
      `/tickets/${id}/comments`,
      data
    );
    return response.data.data;
  },

  /**
   * Resolve ticket
   */
  resolve: async (id: string): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { status: 'resolved', resolved_at: new Date().toISOString() }
    );
    return response.data.data;
  },

  /**
   * Close ticket
   */
  close: async (id: string): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { status: 'closed', closed_at: new Date().toISOString() }
    );
    return response.data.data;
  },

  /**
   * Reopen ticket
   */
  reopen: async (id: string): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      { status: 'open' }
    );
    return response.data.data;
  },

  /**
   * Get ticket statistics
   */
  getStats: async (params?: { assignee_id?: string; team_id?: string; date_from?: string; date_to?: string }): Promise<TicketStats> => {
    const response = await api.get<ApiResponse<TicketStats>>(
      '/tickets/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get ticket activity/timeline
   */
  getActivity: async (id: string): Promise<unknown[]> => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/tickets/${id}/activity`
    );
    return response.data.data;
  },

  /**
   * Merge tickets
   */
  merge: async (sourceId: string, targetId: string): Promise<Ticket> => {
    const response = await api.post<ApiResponse<Ticket>>(
      `/tickets/${targetId}/merge`,
      { source_id: sourceId }
    );
    return response.data.data;
  },
};

export default ticketService;
