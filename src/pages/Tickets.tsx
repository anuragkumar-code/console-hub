import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant, getPriorityVariant } from '@/components/ui/status-badge';
import { tickets } from '@/data/mockData';
import { Ticket as TicketType } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle } from 'lucide-react';

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<TicketType>[] = [
    {
      key: 'ticketNumber',
      label: 'Ticket #',
      render: (ticket) => (
        <span className="font-mono text-sm">{ticket.ticketNumber}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (ticket) => (
        <div className="max-w-xs">
          <span className="font-medium">{ticket.subject}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (ticket) => (
        <StatusBadge variant={getStatusVariant(ticket.status)}>
          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (ticket) => (
        <StatusBadge variant={getPriorityVariant(ticket.priority)}>
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (ticket) => (
        <span className="text-sm">{ticket.assignedTo || 'Unassigned'}</span>
      ),
    },
    {
      key: 'slaBreached',
      label: 'SLA',
      render: (ticket) => (
        ticket.slaBreached ? (
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
      key: 'createdAt',
      label: 'Created',
      render: (ticket) => (
        <span className="text-sm text-muted-foreground">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Manage support tickets and requests"
        action={{
          label: 'Create Ticket',
          onClick: () => console.log('Create ticket'),
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <DataTable
          data={filteredTickets}
          columns={columns}
          onRowClick={(ticket) => console.log('View ticket', ticket.id)}
          emptyMessage="No tickets found"
        />
      </div>
    </div>
  );
}
