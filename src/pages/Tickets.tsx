import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant, getPriorityVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertTriangle, RefreshCw, AlertCircle, TicketIcon } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useTickets, 
  useDeleteTicket,
  useResolveTicket,
  useCloseTicket,
} from '@/hooks/queries';
import type { Ticket, TicketStatus, TicketPriority } from '@/services/tickets';

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate } = usePermission();

  // Fetch tickets from API
  const { 
    data: ticketsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useTickets({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteTicket();
  const resolveMutation = useResolveTicket();
  const closeMutation = useCloseTicket();

  // Get tickets list
  const tickets = ticketsData?.items || [];

  const getTicketStatusVariant = (status: TicketStatus) => {
    switch (status) {
      case 'open': return 'info';
      case 'pending': return 'warning';
      case 'in_progress': return 'default';
      case 'resolved': return 'success';
      case 'closed': return 'muted';
      default: return 'default';
    }
  };

  const getTicketPriorityVariant = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'muted';
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

  const isSLABreached = (ticket: Ticket) => {
    return ticket.sla?.is_first_response_breached || ticket.sla?.is_resolution_breached;
  };

  const columns: Column<Ticket>[] = [
    {
      key: 'ticket_number',
      label: 'Ticket #',
      render: (ticket) => (
        <span className="font-mono text-sm">{ticket.ticket_number}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (ticket) => (
        <div className="max-w-xs">
          <span className="font-medium">{ticket.subject}</span>
          {ticket.contact_name && (
            <p className="text-xs text-muted-foreground">{ticket.contact_name}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (ticket) => (
        <StatusBadge variant={getTicketStatusVariant(ticket.status)}>
          {ticket.status.replace(/_/g, ' ').charAt(0).toUpperCase() + 
           ticket.status.replace(/_/g, ' ').slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (ticket) => (
        <StatusBadge variant={getTicketPriorityVariant(ticket.priority)}>
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'assignee_name',
      label: 'Assigned To',
      render: (ticket) => (
        <span className="text-sm">{ticket.assignee_name || 'Unassigned'}</span>
      ),
    },
    {
      key: 'sla',
      label: 'SLA',
      render: (ticket) => (
        isSLABreached(ticket) ? (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <StatusBadge variant="destructive">Breached</StatusBadge>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">OK</span>
        )
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (ticket) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(ticket.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Manage support tickets and requests"
        action={canCreate('tickets') ? {
          label: 'Create Ticket',
          onClick: () => console.log('Create ticket'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
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
              {error instanceof Error ? error.message : 'Failed to load tickets. Please try again.'}
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
            {tickets.length > 0 ? (
              <DataTable
                data={tickets}
                columns={columns}
                onRowClick={(ticket) => console.log('View ticket', ticket.id)}
                emptyMessage="No tickets found"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <TicketIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No tickets found matching your search' : 'No tickets found'}
                </p>
                {!searchQuery && canCreate('tickets') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Create ticket')}
                  >
                    Create your first ticket
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {ticketsData && ticketsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {tickets.length} of {ticketsData.total} tickets
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
