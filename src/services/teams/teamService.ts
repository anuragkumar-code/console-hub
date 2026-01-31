import api, { ApiResponse } from '@/services/api';
import type {
  Team,
  TeamMember,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMemberRequest,
  TeamListParams,
  TeamStats,
  PaginatedResponse,
} from './types';

// ============================================
// Team Service
// ============================================

export const teamService = {
  /**
   * Get all teams (paginated)
   */
  getAll: async (params?: TeamListParams): Promise<PaginatedResponse<Team>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Team>>>(
      '/teams',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get team by ID
   */
  getById: async (id: string): Promise<Team> => {
    const response = await api.get<ApiResponse<Team>>(
      `/teams/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new team
   */
  create: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await api.post<ApiResponse<Team>>(
      '/teams',
      data
    );
    return response.data.data;
  },

  /**
   * Update a team
   */
  update: async (id: string, data: UpdateTeamRequest): Promise<Team> => {
    const response = await api.put<ApiResponse<Team>>(
      `/teams/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a team
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  /**
   * Get team members
   */
  getMembers: async (id: string): Promise<TeamMember[]> => {
    const response = await api.get<ApiResponse<TeamMember[]>>(
      `/teams/${id}/members`
    );
    return response.data.data;
  },

  /**
   * Add member to team
   */
  addMember: async (id: string, data: TeamMemberRequest): Promise<TeamMember> => {
    const response = await api.post<ApiResponse<TeamMember>>(
      `/teams/${id}/members`,
      data
    );
    return response.data.data;
  },

  /**
   * Remove member from team
   */
  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/members/${userId}`);
  },

  /**
   * Update member role
   */
  updateMemberRole: async (teamId: string, userId: string, role: 'lead' | 'member'): Promise<TeamMember> => {
    const response = await api.put<ApiResponse<TeamMember>>(
      `/teams/${teamId}/members/${userId}`,
      { role }
    );
    return response.data.data;
  },

  /**
   * Get team statistics
   */
  getStats: async (id: string): Promise<TeamStats> => {
    const response = await api.get<ApiResponse<TeamStats>>(
      `/teams/${id}/stats`
    );
    return response.data.data;
  },

  /**
   * Activate a team
   */
  activate: async (id: string): Promise<Team> => {
    const response = await api.put<ApiResponse<Team>>(
      `/teams/${id}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Deactivate a team
   */
  deactivate: async (id: string): Promise<Team> => {
    const response = await api.put<ApiResponse<Team>>(
      `/teams/${id}`,
      { status: 'inactive' }
    );
    return response.data.data;
  },
};

export default teamService;
