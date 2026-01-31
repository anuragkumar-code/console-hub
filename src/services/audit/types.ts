// ============================================
// Audit Log Types
// ============================================

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout' 
  | 'export' 
  | 'import'
  | 'assign'
  | 'unassign'
  | 'invite'
  | 'activate'
  | 'deactivate'
  | 'suspend'
  | 'restore'
  | 'permission_change'
  | 'password_change'
  | 'settings_change';

export type AuditResource = 
  | 'user' 
  | 'organization' 
  | 'role' 
  | 'permission'
  | 'contact' 
  | 'account' 
  | 'deal' 
  | 'ticket'
  | 'conversation'
  | 'channel'
  | 'team'
  | 'settings'
  | 'api_key'
  | 'webhook';

/**
 * Audit log entry from API
 */
export interface AuditLog {
  id: string;
  organization_id?: string;
  organization_name?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  action: AuditAction;
  resource: AuditResource;
  resource_id?: string;
  resource_name?: string;
  description: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Audit log list query params
 */
export interface AuditLogListParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: AuditAction | AuditAction[];
  resource?: AuditResource | AuditResource[];
  user_id?: string;
  organization_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Audit log statistics
 */
export interface AuditLogStats {
  total_logs: number;
  logs_today: number;
  logs_this_week: number;
  actions_by_type: Record<AuditAction, number>;
  resources_by_type: Record<AuditResource, number>;
  most_active_users: Array<{
    user_id: string;
    user_name: string;
    action_count: number;
  }>;
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
