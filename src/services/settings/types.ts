// ============================================
// Settings Types
// ============================================

/**
 * Organization general settings
 */
export interface GeneralSettings {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  // Notification preferences
  notify_new_ticket: boolean;
  notify_ticket_assigned: boolean;
  notify_ticket_resolved: boolean;
  notify_new_deal: boolean;
  notify_deal_won: boolean;
  notify_deal_lost: boolean;
  notify_new_conversation: boolean;
  notify_mention: boolean;
  // Digest settings
  daily_digest: boolean;
  weekly_report: boolean;
}

/**
 * Security settings
 */
export interface SecuritySettings {
  two_factor_enabled: boolean;
  two_factor_method?: 'email' | 'sms' | 'authenticator';
  session_timeout: number; // minutes
  password_expiry_days: number;
  require_strong_password: boolean;
  allowed_ip_addresses?: string[];
  login_attempts_limit: number;
  lockout_duration: number; // minutes
}

/**
 * Branding settings
 */
export interface BrandingSettings {
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  favicon_url?: string;
  email_logo_url?: string;
  custom_css?: string;
}

/**
 * Integration settings
 */
export interface IntegrationSettings {
  api_enabled: boolean;
  webhook_enabled: boolean;
  webhooks?: Array<{
    id: string;
    url: string;
    events: string[];
    is_active: boolean;
  }>;
  api_keys?: Array<{
    id: string;
    name: string;
    key_prefix: string;
    created_at: string;
    last_used_at?: string;
  }>;
}

/**
 * Complete organization settings
 */
export interface OrganizationSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  branding: BrandingSettings;
  integrations: IntegrationSettings;
}

/**
 * User profile settings
 */
export interface UserProfileSettings {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

/**
 * Update settings request
 */
export interface UpdateSettingsRequest {
  general?: Partial<GeneralSettings>;
  notifications?: Partial<NotificationSettings>;
  security?: Partial<SecuritySettings>;
  branding?: Partial<BrandingSettings>;
  integrations?: Partial<IntegrationSettings>;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * API Key create request
 */
export interface CreateApiKeyRequest {
  name: string;
  expires_at?: string;
}

/**
 * API Key response (with full key - only shown on creation)
 */
export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string; // Full key - only returned on creation
  key_prefix: string;
  expires_at?: string;
  created_at: string;
}

/**
 * Webhook create/update request
 */
export interface WebhookRequest {
  url: string;
  events: string[];
  is_active?: boolean;
  secret?: string;
}
