import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import type {
  UpdateSettingsRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  CreateApiKeyRequest,
  WebhookRequest,
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  BrandingSettings,
} from '@/services/settings';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  organization: () => [...settingsKeys.all, 'organization'] as const,
  general: () => [...settingsKeys.all, 'general'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
  security: () => [...settingsKeys.all, 'security'] as const,
  branding: () => [...settingsKeys.all, 'branding'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  apiKeys: () => [...settingsKeys.all, 'apiKeys'] as const,
  webhooks: () => [...settingsKeys.all, 'webhooks'] as const,
};

// ============================================
// Organization Settings Hooks
// ============================================

/**
 * Hook to fetch all organization settings
 */
export function useOrganizationSettings() {
  return useQuery({
    queryKey: settingsKeys.organization(),
    queryFn: () => settingsService.getOrganizationSettings(),
  });
}

/**
 * Hook to update organization settings
 */
export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.updateOrganizationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast({
        title: 'Settings saved',
        description: 'Organization settings have been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to fetch general settings
 */
export function useGeneralSettings() {
  return useQuery({
    queryKey: settingsKeys.general(),
    queryFn: () => settingsService.getGeneralSettings(),
  });
}

/**
 * Hook to update general settings
 */
export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<GeneralSettings>) => settingsService.updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.general() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast({
        title: 'Settings saved',
        description: 'General settings have been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to fetch notification settings
 */
export function useNotificationSettings() {
  return useQuery({
    queryKey: settingsKeys.notifications(),
    queryFn: () => settingsService.getNotificationSettings(),
  });
}

/**
 * Hook to update notification settings
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => settingsService.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast({
        title: 'Settings saved',
        description: 'Notification settings have been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to fetch security settings
 */
export function useSecuritySettings() {
  return useQuery({
    queryKey: settingsKeys.security(),
    queryFn: () => settingsService.getSecuritySettings(),
  });
}

/**
 * Hook to update security settings
 */
export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<SecuritySettings>) => settingsService.updateSecuritySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.security() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast({
        title: 'Settings saved',
        description: 'Security settings have been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// Profile Hooks
// ============================================

/**
 * Hook to fetch user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: () => settingsService.getProfile(),
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => settingsService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating profile',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => settingsService.changePassword(data),
    onSuccess: () => {
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error changing password',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => settingsService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast({
        title: 'Avatar uploaded',
        description: 'Your avatar has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error uploading avatar',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// API Keys Hooks
// ============================================

/**
 * Hook to fetch API keys
 */
export function useApiKeys() {
  return useQuery({
    queryKey: settingsKeys.apiKeys(),
    queryFn: () => settingsService.getApiKeys(),
  });
}

/**
 * Hook to create API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => settingsService.createApiKey(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
      toast({
        title: 'API key created',
        description: 'Make sure to copy the key now. It won\'t be shown again.',
      });
      return result;
    },
    onError: (error) => {
      toast({
        title: 'Error creating API key',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => settingsService.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
      toast({
        title: 'API key deleted',
        description: 'The API key has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting API key',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// Webhooks Hooks
// ============================================

/**
 * Hook to fetch webhooks
 */
export function useWebhooks() {
  return useQuery({
    queryKey: settingsKeys.webhooks(),
    queryFn: () => settingsService.getWebhooks(),
  });
}

/**
 * Hook to create webhook
 */
export function useCreateWebhook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: WebhookRequest) => settingsService.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.webhooks() });
      toast({
        title: 'Webhook created',
        description: 'The webhook has been created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating webhook',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete webhook
 */
export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => settingsService.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.webhooks() });
      toast({
        title: 'Webhook deleted',
        description: 'The webhook has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting webhook',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to test webhook
 */
export function useTestWebhook() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => settingsService.testWebhook(id),
    onSuccess: (result) => {
      toast({
        title: result.success ? 'Webhook test successful' : 'Webhook test failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error testing webhook',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
