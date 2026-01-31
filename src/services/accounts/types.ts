// ============================================
// Account Types
// ============================================

export type AccountStatus = 'active' | 'inactive' | 'prospect' | 'customer' | 'churned';
export type AccountType = 'prospect' | 'customer' | 'partner' | 'competitor' | 'vendor' | 'other';
export type AccountIndustry = 
  | 'technology' 
  | 'healthcare' 
  | 'finance' 
  | 'education' 
  | 'retail' 
  | 'manufacturing' 
  | 'consulting'
  | 'real_estate'
  | 'media'
  | 'government'
  | 'nonprofit'
  | 'other';

/**
 * Account custom fields stored as JSONB
 */
export interface AccountCustomFields {
  [key: string]: string | number | boolean | null;
}

/**
 * Account from API response
 */
export interface Account {
  id: string;
  organization_id: string;
  name: string;
  type: AccountType;
  industry?: AccountIndustry;
  website?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  description?: string;
  annual_revenue?: number;
  employee_count?: number;
  // Billing address
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  billing_postal_code?: string;
  // Shipping address
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_postal_code?: string;
  status: AccountStatus;
  tags?: string[];
  custom_fields?: AccountCustomFields;
  owner_id?: string;
  owner_name?: string;
  parent_account_id?: string;
  parent_account_name?: string;
  contact_count?: number;
  deal_count?: number;
  total_deal_value?: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create account request
 */
export interface CreateAccountRequest {
  name: string;
  type?: AccountType;
  industry?: AccountIndustry;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  annual_revenue?: number;
  employee_count?: number;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  billing_postal_code?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_postal_code?: string;
  status?: AccountStatus;
  tags?: string[];
  custom_fields?: AccountCustomFields;
  owner_id?: string;
  parent_account_id?: string;
}

/**
 * Update account request
 */
export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {
  status?: AccountStatus;
}

/**
 * Account list query params
 */
export interface AccountListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AccountStatus;
  type?: AccountType;
  industry?: AccountIndustry;
  owner_id?: string;
  tags?: string[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
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
