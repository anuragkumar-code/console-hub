import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { UsersRound, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useTeams, 
  useDeleteTeam,
  useActivateTeam,
  useDeactivateTeam,
} from '@/hooks/queries';
import type { Team, TeamStatus } from '@/services/teams';

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  // Fetch teams from API
  const { 
    data: teamsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useTeams({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteTeam();
  const activateMutation = useActivateTeam();
  const deactivateMutation = useDeactivateTeam();

  // Get teams list
  const teams = teamsData?.items || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleStatus = (team: Team) => {
    if (team.status === 'active') {
      deactivateMutation.mutate(team.id);
    } else {
      activateMutation.mutate(team.id);
    }
  };

  // Build actions array based on permissions
  const getTeamActions = (team: Team) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Members', onClick: () => console.log('View members', team.id) },
    ];

    if (canUpdate('teams')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', team.id) });
      actions.push({ 
        label: team.status === 'active' ? 'Deactivate' : 'Activate', 
        onClick: () => handleToggleStatus(team),
        destructive: team.status === 'active',
      });
    }

    if (canDelete('teams')) {
      actions.push({ 
        label: 'Delete', 
        onClick: () => {
          if (window.confirm('Are you sure you want to delete this team?')) {
            deleteMutation.mutate(team.id);
          }
        }, 
        destructive: true 
      });
    }

    return actions;
  };

  return (
    <div>
      <PageHeader
        title="Teams"
        description="Manage teams and team members"
        action={canCreate('teams') ? {
          label: 'Create Team',
          onClick: () => console.log('Create team'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </PageHeader>

      <div className="p-6">
        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load teams. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {teams.map((team) => (
                <DataCard
                  key={team.id}
                  title={team.name}
                  subtitle={team.description || team.slug}
                  icon={<UsersRound className="h-5 w-5 text-muted-foreground" />}
                  badges={
                    <StatusBadge variant={getStatusVariant(team.status as TeamStatus)}>
                      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                    </StatusBadge>
                  }
                  metadata={[
                    { label: 'Members', value: team.member_count },
                    { label: 'Lead', value: team.lead_name || 'No lead' },
                    { label: 'Created', value: formatDate(team.created_at) },
                  ]}
                  onClick={() => console.log('View team', team.id)}
                  actions={getTeamActions(team)}
                />
              ))}
            </CardGrid>

            {/* Empty State */}
            {teams.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <UsersRound className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No teams found matching your search' : 'No teams found'}
                </p>
                {!searchQuery && canCreate('teams') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Create team')}
                  >
                    Create your first team
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {teamsData && teamsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {teams.length} of {teamsData.total} teams
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
