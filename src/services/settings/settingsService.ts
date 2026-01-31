import api, { ApiResponse } from '@/services/api';
import type {
  OrganizationSettings,
  UserProfileSettings,
  UpdateSettingsRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  CreateApiKeyRequest,
  ApiKeyResponse,
  WebhookRequest,
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  BrandingSettings,
} from './types';

// ============================================
// Settings Service
// ============================================

export const settingsService = {
  // ============================================
  // Organization Settings
  // ============================================

  /**
   * Get all organization settings
   */
  getOrganizationSettings: async (): Promise<OrganizationSettings> => {
    const response = await api.get<ApiResponse<OrganizationSettings>>(
      '/settings'
    );
    return response.data.data;
  },

  /**
   * Update organization settings
   */
  updateOrganizationSettings: async (data: UpdateSettingsRequest): Promise<OrganizationSettings> => {
    const response = await api.put<ApiResponse<OrganizationSettings>>(
      '/settings',
      data
    );
    return response.data.data;
  },

  /**
   * Get general settings
   */
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await api.get<ApiResponse<GeneralSettings>>(
      '/settings/general'
    );
    return response.data.data;
  },

  /**
   * Update general settings
   */
  updateGeneralSettings: async (data: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const response = await api.put<ApiResponse<GeneralSettings>>(
      '/settings/general',
      data
    );
    return response.data.data;
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const response = await api.get<ApiResponse<NotificationSettings>>(
      '/settings/notifications'
    );
    return response.data.data;
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    const response = await api.put<ApiResponse<NotificationSettings>>(
      '/settings/notifications',
      data
    );
    return response.data.data;
  },

  /**
   * Get security settings
   */
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await api.get<ApiResponse<SecuritySettings>>(
      '/settings/security'
    );
    return response.data.data;
  },

  /**
   * Update security settings
   */
  updateSecuritySettings: async (data: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    const response = await api.put<ApiResponse<SecuritySettings>>(
      '/settings/security',
      data
    );
    return response.data.data;
  },

  /**
   * Get branding settings
   */
  getBrandingSettings: async (): Promise<BrandingSettings> => {
    const response = await api.get<ApiResponse<BrandingSettings>>(
      '/settings/branding'
    );
    return response.data.data;
  },

  /**
   * Update branding settings
   */
  updateBrandingSettings: async (data: Partial<BrandingSettings>): Promise<BrandingSettings> => {
    const response = await api.put<ApiResponse<BrandingSettings>>(
      '/settings/branding',
      data
    );
    return response.data.data;
  },

  // ============================================
  // Profile Settings
  // ============================================

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfileSettings> => {
    const response = await api.get<ApiResponse<UserProfileSettings>>(
      '/profile'
    );
    return response.data.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileSettings> => {
    const response = await api.put<ApiResponse<UserProfileSettings>>(
      '/profile',
      data
    );
    return response.data.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/profile/change-password',
      data
    );
    return response.data.data;
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post<ApiResponse<{ url: string }>>(
      '/profile/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  // ============================================
  // API Keys
  // ============================================

  /**
   * Get all API keys
   */
  getApiKeys: async (): Promise<ApiKeyResponse[]> => {
    const response = await api.get<ApiResponse<ApiKeyResponse[]>>(
      '/settings/api-keys'
    );
    return response.data.data;
  },

  /**
   * Create API key
   */
  createApiKey: async (data: CreateApiKeyRequest): Promise<ApiKeyResponse> => {
    const response = await api.post<ApiResponse<ApiKeyResponse>>(
      '/settings/api-keys',
      data
    );
    return response.data.data;
  },

  /**
   * Delete API key
   */
  deleteApiKey: async (id: string): Promise<void> => {
    await api.delete(`/settings/api-keys/${id}`);
  },

  // ============================================
  // Webhooks
  // ============================================

  /**
   * Get all webhooks
   */
  getWebhooks: async (): Promise<OrganizationSettings['integrations']['webhooks']> => {
    const response = await api.get<ApiResponse<OrganizationSettings['integrations']['webhooks']>>(
      '/settings/webhooks'
    );
    return response.data.data;
  },

  /**
   * Create webhook
   */
  createWebhook: async (data: WebhookRequest): Promise<{ id: string; secret: string }> => {
    const response = await api.post<ApiResponse<{ id: string; secret: string }>>(
      '/settings/webhooks',
      data
    );
    return response.data.data;
  },

  /**
   * Update webhook
   */
  updateWebhook: async (id: string, data: Partial<WebhookRequest>): Promise<void> => {
    await api.put(`/settings/webhooks/${id}`, data);
  },

  /**
   * Delete webhook
   */
  deleteWebhook: async (id: string): Promise<void> => {
    await api.delete(`/settings/webhooks/${id}`);
  },

  /**
   * Test webhook
   */
  testWebhook: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      `/settings/webhooks/${id}/test`
    );
    return response.data.data;
  },
};

export default settingsService;
