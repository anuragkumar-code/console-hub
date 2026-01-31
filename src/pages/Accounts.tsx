import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { accounts } from '@/data/mockData';
import { Briefcase, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePermission } from '@/hooks/usePermission';

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  const filteredAccounts = accounts.filter(account =>
    account.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Build actions array based on permissions
  const getAccountActions = (accountId: string) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Details', onClick: () => console.log('View', accountId) },
    ];

    if (canUpdate('accounts')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', accountId) });
    }

    if (canDelete('accounts')) {
      actions.push({ label: 'Delete', onClick: () => console.log('Delete', accountId), destructive: true });
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredAccounts.map((account) => (
            <DataCard
              key={account.id}
              title={account.companyName}
              subtitle={account.industry}
              icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
              badges={
                <StatusBadge variant={getStatusVariant(account.status)}>
                  {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                </StatusBadge>
              }
              metadata={[
                { label: 'Contacts', value: account.contactCount },
                { label: 'Deal Value', value: formatCurrency(account.dealValue) },
                { label: 'Owner', value: account.owner },
              ]}
              onClick={() => console.log('View account', account.id)}
              actions={getAccountActions(account.id)}
            />
          ))}
        </CardGrid>

        {filteredAccounts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No accounts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
