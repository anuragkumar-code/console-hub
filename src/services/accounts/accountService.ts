import api, { ApiResponse } from '@/services/api';
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountListParams,
  PaginatedResponse,
} from './types';
import type { Contact } from '@/services/contacts';

// ============================================
// Account Service
// ============================================

export const accountService = {
  /**
   * Get all accounts (paginated)
   */
  getAll: async (params?: AccountListParams): Promise<PaginatedResponse<Account>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Account>>>(
      '/accounts',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get account by ID
   */
  getById: async (id: string): Promise<Account> => {
    const response = await api.get<ApiResponse<Account>>(
      `/accounts/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new account
   */
  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>(
      '/accounts',
      data
    );
    return response.data.data;
  },

  /**
   * Update an account
   */
  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const response = await api.put<ApiResponse<Account>>(
      `/accounts/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete an account
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },

  /**
   * Get contacts associated with an account
   */
  getContacts: async (id: string): Promise<Contact[]> => {
    const response = await api.get<ApiResponse<Contact[]>>(
      `/accounts/${id}/contacts`
    );
    return response.data.data;
  },

  /**
   * Get deals associated with an account
   */
  getDeals: async (id: string): Promise<unknown[]> => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/accounts/${id}/deals`
    );
    return response.data.data;
  },

  /**
   * Get account activity/timeline
   */
  getActivity: async (id: string): Promise<unknown[]> => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/accounts/${id}/activity`
    );
    return response.data.data;
  },

  /**
   * Merge two accounts
   */
  merge: async (sourceId: string, targetId: string): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>(
      `/accounts/${targetId}/merge`,
      { source_id: sourceId }
    );
    return response.data.data;
  },
};

export default accountService;
