import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { teams } from '@/data/mockData';
import { UsersRound, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePermission } from '@/hooks/usePermission';

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build actions array based on permissions
  const getTeamActions = (teamId: string) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Members', onClick: () => console.log('View members', teamId) },
    ];

    if (canUpdate('teams')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', teamId) });
    }

    if (canDelete('teams')) {
      actions.push({ label: 'Delete', onClick: () => console.log('Delete', teamId), destructive: true });
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredTeams.map((team) => (
            <DataCard
              key={team.id}
              title={team.name}
              subtitle={team.description}
              icon={<UsersRound className="h-5 w-5 text-muted-foreground" />}
              metadata={[
                { label: 'Members', value: team.memberCount },
                { label: 'Created', value: new Date(team.createdAt).toLocaleDateString() },
              ]}
              onClick={() => console.log('View team', team.id)}
              actions={getTeamActions(team.id)}
            />
          ))}
        </CardGrid>

        {filteredTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <UsersRound className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No teams found</p>
          </div>
        )}
      </div>
    </div>
  );
}
