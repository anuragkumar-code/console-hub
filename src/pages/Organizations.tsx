import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Building2, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { CreateOrganizationForm } from '@/components/forms/CreateOrganizationForm';
import { 
  useOrganizations, 
  useSuspendOrganization,
  useActivateOrganization,
  useDeleteOrganization,
} from '@/hooks/queries';
import type { Organization, PlanType, OrganizationStatus } from '@/services/organizations';

export default function Organizations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch organizations from API
  const { 
    data: organizationsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useOrganizations({ search: searchQuery || undefined });

  // Mutations
  const suspendMutation = useSuspendOrganization();
  const activateMutation = useActivateOrganization();
  const deleteMutation = useDeleteOrganization();

  // Get organizations list (handle both paginated and array responses)
  const organizations = organizationsData?.items || [];

  const getPlanBadgeVariant = (plan: PlanType | string) => {
    switch (plan) {
      case 'enterprise': return 'info';
      case 'professional': return 'success';
      case 'starter': return 'warning';
      case 'trial': return 'warning';
      default: return 'muted';
    }
  };

  const handleSuspend = (org: Organization) => {
    if (org.status === 'suspended') {
      activateMutation.mutate(org.id);
    } else {
      suspendMutation.mutate(org.id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
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
              {error instanceof Error ? error.message : 'Failed to load organizations. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {organizations.map((org) => (
                <DataCard
                  key={org.id}
                  title={org.name}
                  subtitle={org.industry || org.slug}
                  icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
                  badges={
                    <>
                      <StatusBadge variant={getStatusVariant(org.status as OrganizationStatus)}>
                        {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                      </StatusBadge>
                      <StatusBadge variant={getPlanBadgeVariant(org.plan_type)}>
                        {org.plan_type.charAt(0).toUpperCase() + org.plan_type.slice(1)}
                      </StatusBadge>
                    </>
                  }
                  metadata={[
                    { label: 'Users', value: org.user_count ?? 0 },
                    { label: 'Created', value: formatDate(org.created_at) },
                  ]}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                  actions={[
                    { label: 'View Details', onClick: () => navigate(`/organizations/${org.id}`) },
                    { label: 'Edit', onClick: () => navigate(`/organizations/${org.id}?edit=true`) },
                    { 
                      label: org.status === 'suspended' ? 'Activate' : 'Suspend', 
                      onClick: () => handleSuspend(org),
                      destructive: org.status !== 'suspended',
                    },
                    { 
                      label: 'Delete', 
                      onClick: () => handleDelete(org.id), 
                      destructive: true 
                    },
                  ]}
                />
              ))}
            </CardGrid>

            {/* Empty State */}
            {organizations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No organizations found matching your search' : 'No organizations found'}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    Create your first organization
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {organizationsData && organizationsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {organizations.length} of {organizationsData.total} organizations
              </div>
            )}
          </>
        )}
      </div>

      <CreateOrganizationForm 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
