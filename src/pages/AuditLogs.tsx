import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw, AlertCircle, Download, FileText } from 'lucide-react';
import { useAuditLogs, useExportAuditLogs, useAuditLogStats } from '@/hooks/queries';
import type { AuditLog, AuditAction, AuditResource } from '@/services/audit';

const actionOptions: { value: AuditAction; label: string }[] = [
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'permission_change', label: 'Permission Change' },
  { value: 'settings_change', label: 'Settings Change' },
];

const resourceOptions: { value: AuditResource; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'organization', label: 'Organization' },
  { value: 'role', label: 'Role' },
  { value: 'contact', label: 'Contact' },
  { value: 'account', label: 'Account' },
  { value: 'deal', label: 'Deal' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'channel', label: 'Channel' },
  { value: 'team', label: 'Team' },
];

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceFilter, setResourceFilter] = useState<string>('');

  // Fetch audit logs
  const { 
    data: logsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useAuditLogs({ 
    search: searchQuery || undefined,
    action: actionFilter ? (actionFilter as AuditAction) : undefined,
    resource: resourceFilter ? (resourceFilter as AuditResource) : undefined,
  });

  // Export mutation
  const exportMutation = useExportAuditLogs();

  const logs = logsData?.items || [];

  const getActionVariant = (action: AuditAction) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
      case 'deactivate':
        return 'destructive';
      case 'suspend':
        return 'warning';
      case 'login':
      case 'logout':
        return 'muted';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAction = (action: AuditAction) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatResource = (resource: AuditResource) => {
    return resource.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleExport = () => {
    exportMutation.mutate({
      search: searchQuery || undefined,
      action: actionFilter ? (actionFilter as AuditAction) : undefined,
      resource: resourceFilter ? (resourceFilter as AuditResource) : undefined,
    });
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'created_at',
      label: 'Time',
      render: (log) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(log.created_at)}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log) => (
        <StatusBadge variant={getActionVariant(log.action)}>
          {formatAction(log.action)}
        </StatusBadge>
      ),
    },
    {
      key: 'user_name',
      label: 'User',
      render: (log) => (
        <div>
          <span className="font-medium text-sm">{log.user_name}</span>
          <p className="text-xs text-muted-foreground">{log.user_email}</p>
        </div>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (log) => (
        <div>
          <span className="text-sm">{formatResource(log.resource)}</span>
          {log.resource_name && (
            <p className="text-xs text-muted-foreground">{log.resource_name}</p>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (log) => (
        <span className="text-sm text-muted-foreground max-w-xs truncate block">
          {log.description}
        </span>
      ),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
      render: (log) => (
        <span className="font-mono text-xs text-muted-foreground">
          {log.ip_address || 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="View platform activity and changes"
        action={{
          label: 'Export',
          onClick: handleExport,
          icon: <Download className="h-4 w-4" />,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              {actionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Resources</SelectItem>
              {resourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {error instanceof Error ? error.message : 'Failed to load audit logs. Please try again.'}
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
            {logs.length > 0 ? (
              <DataTable
                data={logs}
                columns={columns}
                emptyMessage="No audit logs found"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || actionFilter || resourceFilter 
                    ? 'No audit logs found matching your filters' 
                    : 'No audit logs found'}
                </p>
              </div>
            )}

            {/* Pagination info */}
            {logsData && logsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {logs.length} of {logsData.total} logs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
