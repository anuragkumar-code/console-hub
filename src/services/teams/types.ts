// ============================================
// Team Types
// ============================================

export type TeamStatus = 'active' | 'inactive';

/**
 * Team member
 */
export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  role: 'lead' | 'member';
  joined_at: string;
}

/**
 * Team from API response
 */
export interface Team {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  status: TeamStatus;
  lead_id?: string;
  lead_name?: string;
  member_count: number;
  members?: TeamMember[];
  settings?: {
    auto_assign?: boolean;
    max_conversations?: number;
    working_hours?: {
      timezone?: string;
      schedule?: Record<string, { start: string; end: string }>;
    };
  };
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Create team request
 */
export interface CreateTeamRequest {
  name: string;
  slug?: string;
  description?: string;
  lead_id?: string;
  member_ids?: string[];
  settings?: Team['settings'];
}

/**
 * Update team request
 */
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  status?: TeamStatus;
  lead_id?: string;
  settings?: Team['settings'];
}

/**
 * Add/Remove team member request
 */
export interface TeamMemberRequest {
  user_id: string;
  role?: 'lead' | 'member';
}

/**
 * Team list query params
 */
export interface TeamListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TeamStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Team statistics
 */
export interface TeamStats {
  total_members: number;
  active_conversations: number;
  resolved_today: number;
  avg_response_time: number;
  avg_resolution_time: number;
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
