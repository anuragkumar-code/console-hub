import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { deals } from '@/data/mockData';
import { Deal } from '@/types';
import { usePermission } from '@/hooks/usePermission';

export default function Deals() {
  const { canCreate } = usePermission();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageLabel = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const columns: Column<Deal>[] = [
    {
      key: 'title',
      label: 'Deal',
      render: (deal) => (
        <div>
          <span className="font-medium">{deal.title}</span>
          <p className="text-xs text-muted-foreground">{deal.account}</p>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (deal) => (
        <span className="font-medium">{formatCurrency(deal.value)}</span>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (deal) => (
        <StatusBadge variant={getStatusVariant(deal.stage)}>
          {getStageLabel(deal.stage)}
        </StatusBadge>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (deal) => (
        <span className="text-sm">{deal.probability}%</span>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (deal) => (
        <span className="text-sm">{deal.owner}</span>
      ),
    },
    {
      key: 'expectedCloseDate',
      label: 'Close Date',
      render: (deal) => (
        <span className="text-sm text-muted-foreground">
          {new Date(deal.expectedCloseDate).toLocaleDateString()}
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
      />

      <div className="p-6">
        <DataTable
          data={deals}
          columns={columns}
          onRowClick={(deal) => console.log('View deal', deal.id)}
          emptyMessage="No deals found"
        />
      </div>
    </div>
  );
}
