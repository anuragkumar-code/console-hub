import api, { ApiResponse } from '@/services/api';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListParams,
  PaginatedResponse,
} from './types';

// ============================================
// Contact Service
// ============================================

export const contactService = {
  /**
   * Get all contacts (paginated)
   */
  getAll: async (params?: ContactListParams): Promise<PaginatedResponse<Contact>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Contact>>>(
      '/contacts',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get contact by ID
   */
  getById: async (id: string): Promise<Contact> => {
    const response = await api.get<ApiResponse<Contact>>(
      `/contacts/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new contact
   */
  create: async (data: CreateContactRequest): Promise<Contact> => {
    const response = await api.post<ApiResponse<Contact>>(
      '/contacts',
      data
    );
    return response.data.data;
  },

  /**
   * Update a contact
   */
  update: async (id: string, data: UpdateContactRequest): Promise<Contact> => {
    const response = await api.put<ApiResponse<Contact>>(
      `/contacts/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a contact
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },

  /**
   * Archive a contact
   */
  archive: async (id: string): Promise<Contact> => {
    const response = await api.put<ApiResponse<Contact>>(
      `/contacts/${id}`,
      { status: 'archived' }
    );
    return response.data.data;
  },

  /**
   * Restore an archived contact
   */
  restore: async (id: string): Promise<Contact> => {
    const response = await api.put<ApiResponse<Contact>>(
      `/contacts/${id}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Add tags to a contact
   */
  addTags: async (id: string, tags: string[]): Promise<Contact> => {
    const response = await api.post<ApiResponse<Contact>>(
      `/contacts/${id}/tags`,
      { tags }
    );
    return response.data.data;
  },

  /**
   * Get contact activity/timeline
   */
  getActivity: async (id: string): Promise<unknown[]> => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/contacts/${id}/activity`
    );
    return response.data.data;
  },
};

export default contactService;
