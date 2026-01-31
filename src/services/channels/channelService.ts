import api, { ApiResponse } from '@/services/api';
import type {
  Channel,
  CreateChannelRequest,
  UpdateChannelRequest,
  ChannelListParams,
  ChannelStats,
  PaginatedResponse,
} from './types';

// ============================================
// Channel Service
// ============================================

export const channelService = {
  /**
   * Get all channels (paginated)
   */
  getAll: async (params?: ChannelListParams): Promise<PaginatedResponse<Channel>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Channel>>>(
      '/channels',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get channel by ID
   */
  getById: async (id: string): Promise<Channel> => {
    const response = await api.get<ApiResponse<Channel>>(
      `/channels/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new channel
   */
  create: async (data: CreateChannelRequest): Promise<Channel> => {
    const response = await api.post<ApiResponse<Channel>>(
      '/channels',
      data
    );
    return response.data.data;
  },

  /**
   * Update a channel
   */
  update: async (id: string, data: UpdateChannelRequest): Promise<Channel> => {
    const response = await api.put<ApiResponse<Channel>>(
      `/channels/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a channel
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/channels/${id}`);
  },

  /**
   * Get channel statistics
   */
  getStats: async (id: string): Promise<ChannelStats> => {
    const response = await api.get<ApiResponse<ChannelStats>>(
      `/channels/${id}/stats`
    );
    return response.data.data;
  },

  /**
   * Activate a channel
   */
  activate: async (id: string): Promise<Channel> => {
    const response = await api.put<ApiResponse<Channel>>(
      `/channels/${id}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Deactivate a channel
   */
  deactivate: async (id: string): Promise<Channel> => {
    const response = await api.put<ApiResponse<Channel>>(
      `/channels/${id}`,
      { status: 'inactive' }
    );
    return response.data.data;
  },

  /**
   * Set channel as default
   */
  setAsDefault: async (id: string): Promise<Channel> => {
    const response = await api.put<ApiResponse<Channel>>(
      `/channels/${id}`,
      { is_default: true }
    );
    return response.data.data;
  },

  /**
   * Test channel connection/configuration
   */
  testConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      `/channels/${id}/test`
    );
    return response.data.data;
  },
};

export default channelService;
