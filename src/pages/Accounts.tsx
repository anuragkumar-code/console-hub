import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { Briefcase, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useAccounts, 
  useDeleteAccount,
} from '@/hooks/queries';
import type { Account, AccountStatus } from '@/services/accounts';

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  // Fetch accounts from API
  const { 
    data: accountsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useAccounts({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteAccount();

  // Get accounts list
  const accounts = accountsData?.items || [];

  const formatCurrency = (value?: number, currency = 'USD') => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatIndustry = (industry?: string) => {
    if (!industry) return 'N/A';
    return industry
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Build actions array based on permissions
  const getAccountActions = (account: Account) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Details', onClick: () => console.log('View', account.id) },
    ];

    if (canUpdate('accounts')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', account.id) });
    }

    if (canDelete('accounts')) {
      actions.push({ 
        label: 'Delete', 
        onClick: () => {
          if (window.confirm('Are you sure you want to delete this account?')) {
            deleteMutation.mutate(account.id);
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
        title="Accounts"
        description="Manage company accounts and relationships"
        action={canCreate('accounts') ? {
          label: 'Add Account',
          onClick: () => console.log('Add account'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
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
              {error instanceof Error ? error.message : 'Failed to load accounts. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {accounts.map((account) => (
                <DataCard
                  key={account.id}
                  title={account.name}
                  subtitle={formatIndustry(account.industry)}
                  icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
                  badges={
                    <>
                      <StatusBadge variant={getStatusVariant(account.status as AccountStatus)}>
                        {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                      </StatusBadge>
                      {account.type && (
                        <StatusBadge variant="muted">
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </StatusBadge>
                      )}
                    </>
                  }
                  metadata={[
                    { label: 'Contacts', value: account.contact_count ?? 0 },
                    { label: 'Deal Value', value: formatCurrency(account.total_deal_value) },
                    { label: 'Owner', value: account.owner_name || 'Unassigned' },
                  ]}
                  onClick={() => console.log('View account', account.id)}
                  actions={getAccountActions(account)}
                />
              ))}
            </CardGrid>

            {/* Empty State */}
            {accounts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No accounts found matching your search' : 'No accounts found'}
                </p>
                {!searchQuery && canCreate('accounts') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Add account')}
                  >
                    Add your first account
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {accountsData && accountsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {accounts.length} of {accountsData.total} accounts
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
