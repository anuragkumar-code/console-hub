import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Search, DollarSign } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useDeals, 
  useDeleteDeal,
  useMarkDealAsWon,
  useMarkDealAsLost,
} from '@/hooks/queries';
import type { Deal, DealStage } from '@/services/deals';

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate } = usePermission();

  // Fetch deals from API
  const { 
    data: dealsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useDeals({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteDeal();
  const markWonMutation = useMarkDealAsWon();
  const markLostMutation = useMarkDealAsLost();

  // Get deals list
  const deals = dealsData?.items || [];

  const formatCurrency = (value?: number, currency = 'USD') => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageLabel = (stage: DealStage) => {
    return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStageVariant = (stage: DealStage) => {
    switch (stage) {
      case 'lead': return 'muted';
      case 'qualified': return 'info';
      case 'proposal': return 'warning';
      case 'negotiation': return 'default';
      case 'closed_won': return 'success';
      case 'closed_lost': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: Column<Deal>[] = [
    {
      key: 'title',
      label: 'Deal',
      render: (deal) => (
        <div>
          <span className="font-medium">{deal.title}</span>
          <p className="text-xs text-muted-foreground">{deal.account_name || 'No account'}</p>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (deal) => (
        <span className="font-medium">{formatCurrency(deal.value, deal.currency)}</span>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (deal) => (
        <StatusBadge variant={getStageVariant(deal.stage)}>
          {getStageLabel(deal.stage)}
        </StatusBadge>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (deal) => (
        <span className="text-sm">{deal.probability || 0}%</span>
      ),
    },
    {
      key: 'owner_name',
      label: 'Owner',
      render: (deal) => (
        <span className="text-sm">{deal.owner_name || 'Unassigned'}</span>
      ),
    },
    {
      key: 'expected_close_date',
      label: 'Close Date',
      render: (deal) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(deal.expected_close_date)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Deals"
        description="Manage your sales pipeline"
        action={canCreate('deals') ? {
          label: 'Create Deal',
          onClick: () => console.log('Create deal'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
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
              {error instanceof Error ? error.message : 'Failed to load deals. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !isError && (
          <>
            {deals.length > 0 ? (
              <DataTable
                data={deals}
                columns={columns}
                onRowClick={(deal) => console.log('View deal', deal.id)}
                emptyMessage="No deals found"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No deals found matching your search' : 'No deals found'}
                </p>
                {!searchQuery && canCreate('deals') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Create deal')}
                  >
                    Create your first deal
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {dealsData && dealsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {deals.length} of {dealsData.total} deals
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
