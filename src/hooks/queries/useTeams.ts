import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teams';
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMemberRequest,
  TeamListParams,
} from '@/services/teams';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (params?: TeamListParams) => [...teamKeys.lists(), params] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  members: (id: string) => [...teamKeys.detail(id), 'members'] as const,
  stats: (id: string) => [...teamKeys.detail(id), 'stats'] as const,
};

/**
 * Hook to fetch paginated teams
 */
export function useTeams(params?: TeamListParams) {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: () => teamService.getAll(params),
  });
}

/**
 * Hook to fetch a single team
 */
export function useTeam(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch team members
 */
export function useTeamMembers(id: string) {
  return useQuery({
    queryKey: teamKeys.members(id),
    queryFn: () => teamService.getMembers(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch team statistics
 */
export function useTeamStats(id: string) {
  return useQuery({
    queryKey: teamKeys.stats(id),
    queryFn: () => teamService.getStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new team
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamService.create(data),
    onSuccess: (newTeam) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      toast({
        title: 'Team created',
        description: `${newTeam.name} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating team',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a team
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamRequest }) =>
      teamService.update(id, data),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(updatedTeam.id) });
      toast({
        title: 'Team updated',
        description: `${updatedTeam.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating team',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a team
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      toast({
        title: 'Team deleted',
        description: 'The team has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting team',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to add member to team
 */
export function useAddTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: TeamMemberRequest }) =>
      teamService.addMember(teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      toast({
        title: 'Member added',
        description: 'Team member has been added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding member',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to remove member from team
 */
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamService.removeMember(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      toast({
        title: 'Member removed',
        description: 'Team member has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error removing member',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to activate a team
 */
export function useActivateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => teamService.activate(id),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(team.id) });
      toast({
        title: 'Team activated',
        description: `${team.name} has been activated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error activating team',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to deactivate a team
 */
export function useDeactivateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => teamService.deactivate(id),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(team.id) });
      toast({
        title: 'Team deactivated',
        description: `${team.name} has been deactivated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deactivating team',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
