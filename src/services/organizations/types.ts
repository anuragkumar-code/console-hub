// ============================================
// Organization Types
// ============================================

export type PlanType = 'free' | 'trial' | 'starter' | 'professional' | 'enterprise';
export type OrganizationStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

/**
 * Organization settings stored as JSONB
 */
export interface OrganizationSettings {
  features?: {
    whatsapp?: boolean;
    email?: boolean;
    sms?: boolean;
    chat_widget?: boolean;
  };
  branding?: {
    logo_url?: string;
    primary_color?: string;
  };
  [key: string]: unknown;
}

/**
 * Organization from API response
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  plan_type: PlanType;
  status: OrganizationStatus;
  settings?: OrganizationSettings;
  max_users?: number;
  max_storage?: number;
  timezone?: string;
  currency?: string;
  date_format?: string;
  industry?: string;
  user_count?: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create organization request
 */
export interface CreateOrganizationRequest {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  plan_type?: PlanType;
  timezone?: string;
  currency?: string;
  date_format?: string;
  max_users?: number;
  max_storage?: number;
  industry?: string;
  settings?: OrganizationSettings;
}

/**
 * Update organization request
 */
export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {
  status?: OrganizationStatus;
}

/**
 * Organization list query params
 */
export interface OrganizationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrganizationStatus;
  plan_type?: PlanType;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Organization statistics
 */
export interface OrganizationStats {
  total_users: number;
  total_contacts: number;
  total_deals: number;
  total_tickets: number;
  storage_used: number;
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
