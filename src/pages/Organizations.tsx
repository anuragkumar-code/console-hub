import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { organizations } from '@/data/mockData';
import { Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CreateOrganizationForm } from '@/components/forms/CreateOrganizationForm';

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'info';
      case 'professional': return 'success';
      case 'starter': return 'warning';
      default: return 'muted';
    }
  };

  return (
    <div>
      <PageHeader
        title="Organizations"
        description="Manage all organizations on the platform"
        action={{
          label: 'Add Organization',
          onClick: () => setIsCreateOpen(true),
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredOrgs.map((org) => (
            <DataCard
              key={org.id}
              title={org.name}
              subtitle={org.industry}
              icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
              badges={
                <>
                  <StatusBadge variant={getStatusVariant(org.status)}>
                    {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                  </StatusBadge>
                  <StatusBadge variant={getPlanBadgeVariant(org.plan)}>
                    {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                  </StatusBadge>
                </>
              }
              metadata={[
                { label: 'Users', value: org.userCount },
                { label: 'Created', value: new Date(org.createdAt).toLocaleDateString() },
              ]}
              onClick={() => console.log('View org', org.id)}
              actions={[
                { label: 'View Details', onClick: () => console.log('View', org.id) },
                { label: 'Edit', onClick: () => console.log('Edit', org.id) },
                { label: 'Suspend', onClick: () => console.log('Suspend', org.id), destructive: true },
              ]}
            />
          ))}
        </CardGrid>

        {filteredOrgs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No organizations found</p>
          </div>
        )}
      </div>

      <CreateOrganizationForm 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
    </div>
  );
}
