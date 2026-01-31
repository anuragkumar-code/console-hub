import api, { ApiResponse } from '@/services/api';
import type {
  Deal,
  CreateDealRequest,
  UpdateDealRequest,
  DealListParams,
  DealStats,
  DealStage,
  Pipeline,
  PaginatedResponse,
} from './types';

// ============================================
// Deal Service
// ============================================

export const dealService = {
  /**
   * Get all deals (paginated)
   */
  getAll: async (params?: DealListParams): Promise<PaginatedResponse<Deal>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Deal>>>(
      '/deals',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get deal by ID
   */
  getById: async (id: string): Promise<Deal> => {
    const response = await api.get<ApiResponse<Deal>>(
      `/deals/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new deal
   */
  create: async (data: CreateDealRequest): Promise<Deal> => {
    const response = await api.post<ApiResponse<Deal>>(
      '/deals',
      data
    );
    return response.data.data;
  },

  /**
   * Update a deal
   */
  update: async (id: string, data: UpdateDealRequest): Promise<Deal> => {
    const response = await api.put<ApiResponse<Deal>>(
      `/deals/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a deal
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/deals/${id}`);
  },

  /**
   * Update deal stage (move in pipeline)
   */
  updateStage: async (id: string, stage: DealStage): Promise<Deal> => {
    const response = await api.put<ApiResponse<Deal>>(
      `/deals/${id}`,
      { stage }
    );
    return response.data.data;
  },

  /**
   * Mark deal as won
   */
  markAsWon: async (id: string, actualCloseDate?: string): Promise<Deal> => {
    const response = await api.put<ApiResponse<Deal>>(
      `/deals/${id}`,
      { 
        stage: 'closed_won',
        actual_close_date: actualCloseDate || new Date().toISOString().split('T')[0]
      }
    );
    return response.data.data;
  },

  /**
   * Mark deal as lost
   */
  markAsLost: async (id: string, lossReason?: string): Promise<Deal> => {
    const response = await api.put<ApiResponse<Deal>>(
      `/deals/${id}`,
      { 
        stage: 'closed_lost',
        actual_close_date: new Date().toISOString().split('T')[0],
        loss_reason: lossReason
      }
    );
    return response.data.data;
  },

  /**
   * Get deal statistics
   */
  getStats: async (params?: { owner_id?: string; date_from?: string; date_to?: string }): Promise<DealStats> => {
    const response = await api.get<ApiResponse<DealStats>>(
      '/deals/stats',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get available pipelines
   */
  getPipelines: async (): Promise<Pipeline[]> => {
    const response = await api.get<ApiResponse<Pipeline[]>>(
      '/pipelines'
    );
    return response.data.data;
  },

  /**
   * Get deal activity/timeline
   */
  getActivity: async (id: string): Promise<unknown[]> => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/deals/${id}/activity`
    );
    return response.data.data;
  },
};

export default dealService;
