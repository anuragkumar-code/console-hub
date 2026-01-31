// ============================================
// Contact Types
// ============================================

export type ContactStatus = 'active' | 'inactive' | 'archived';
export type ContactSource = 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'event' | 'other';

/**
 * Contact custom fields stored as JSONB
 */
export interface ContactCustomFields {
  [key: string]: string | number | boolean | null;
}

/**
 * Contact from API response
 */
export interface Contact {
  id: string;
  organization_id: string;
  account_id?: string;
  account_name?: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  job_title?: string;
  department?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  source?: ContactSource;
  status: ContactStatus;
  tags?: string[];
  notes?: string;
  custom_fields?: ContactCustomFields;
  owner_id?: string;
  owner_name?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create contact request
 */
export interface CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  job_title?: string;
  department?: string;
  account_id?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  source?: ContactSource;
  status?: ContactStatus;
  tags?: string[];
  notes?: string;
  custom_fields?: ContactCustomFields;
  owner_id?: string;
}

/**
 * Update contact request
 */
export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  status?: ContactStatus;
}

/**
 * Contact list query params
 */
export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactStatus;
  source?: ContactSource;
  account_id?: string;
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
