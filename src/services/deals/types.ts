// ============================================
// Deal Types
// ============================================

export type DealStage = 
  | 'lead' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export type DealPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Deal custom fields stored as JSONB
 */
export interface DealCustomFields {
  [key: string]: string | number | boolean | null;
}

/**
 * Deal from API response
 */
export interface Deal {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  value: number;
  currency?: string;
  stage: DealStage;
  probability?: number;
  priority?: DealPriority;
  expected_close_date?: string;
  actual_close_date?: string;
  // Associations
  account_id?: string;
  account_name?: string;
  contact_id?: string;
  contact_name?: string;
  owner_id?: string;
  owner_name?: string;
  // Pipeline info
  pipeline_id?: string;
  pipeline_name?: string;
  // Additional fields
  source?: string;
  loss_reason?: string;
  next_step?: string;
  tags?: string[];
  custom_fields?: DealCustomFields;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create deal request
 */
export interface CreateDealRequest {
  title: string;
  description?: string;
  value: number;
  currency?: string;
  stage?: DealStage;
  probability?: number;
  priority?: DealPriority;
  expected_close_date?: string;
  account_id?: string;
  contact_id?: string;
  owner_id?: string;
  pipeline_id?: string;
  source?: string;
  next_step?: string;
  tags?: string[];
  custom_fields?: DealCustomFields;
}

/**
 * Update deal request
 */
export interface UpdateDealRequest extends Partial<CreateDealRequest> {
  stage?: DealStage;
  actual_close_date?: string;
  loss_reason?: string;
}

/**
 * Deal list query params
 */
export interface DealListParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: DealStage;
  priority?: DealPriority;
  account_id?: string;
  contact_id?: string;
  owner_id?: string;
  pipeline_id?: string;
  min_value?: number;
  max_value?: number;
  expected_close_from?: string;
  expected_close_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Deal statistics
 */
export interface DealStats {
  total_deals: number;
  total_value: number;
  average_value: number;
  won_deals: number;
  won_value: number;
  lost_deals: number;
  conversion_rate: number;
  deals_by_stage: Record<DealStage, number>;
}

/**
 * Pipeline stage
 */
export interface PipelineStage {
  id: string;
  name: string;
  slug: DealStage;
  order: number;
  probability: number;
  color?: string;
}

/**
 * Sales pipeline
 */
export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  is_default: boolean;
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
