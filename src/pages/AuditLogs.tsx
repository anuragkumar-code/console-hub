import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { auditLogs } from '@/data/mockData';
import { AuditLog } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';

export default function AuditLogs() {
  const getActionVariant = (action: string) => {
    if (action.toLowerCase().includes('created')) return 'success';
    if (action.toLowerCase().includes('updated')) return 'info';
    if (action.toLowerCase().includes('deleted') || action.toLowerCase().includes('deactivated')) return 'destructive';
    if (action.toLowerCase().includes('suspended')) return 'warning';
    return 'muted';
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      label: 'Time',
      render: (log) => (
        <span className="text-sm text-muted-foreground">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log) => (
        <StatusBadge variant={getActionVariant(log.action)}>
          {log.action}
        </StatusBadge>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (log) => (
        <span className="font-medium text-sm">{log.user}</span>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (log) => (
        <span className="text-sm">{log.resource}</span>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (log) => (
        <span className="text-sm text-muted-foreground">{log.details}</span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (log) => (
        <span className="font-mono text-xs text-muted-foreground">{log.ipAddress}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="View platform activity and changes"
      />

      <div className="p-6">
        <DataTable
          data={auditLogs}
          columns={columns}
          emptyMessage="No audit logs found"
        />
      </div>
    </div>
  );
}
