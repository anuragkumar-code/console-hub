import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { Contact as ContactIcon, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useContacts, 
  useDeleteContact,
  useArchiveContact,
} from '@/hooks/queries';
import type { Contact, ContactStatus } from '@/services/contacts';

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  // Fetch contacts from API
  const { 
    data: contactsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useContacts({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteContact();
  const archiveMutation = useArchiveContact();

  // Get contacts list
  const contacts = contactsData?.items || [];

  const getDisplayName = (contact: Contact) => {
    return contact.last_name 
      ? `${contact.first_name} ${contact.last_name}`
      : contact.first_name;
  };

  const getInitials = (contact: Contact) => {
    const first = contact.first_name?.[0] || '';
    const last = contact.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'C';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Build actions array based on permissions
  const getContactActions = (contact: Contact) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Details', onClick: () => console.log('View', contact.id) },
    ];

    if (canUpdate('contacts')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', contact.id) });
    }

    if (canUpdate('contacts') && contact.status !== 'archived') {
      actions.push({ 
        label: 'Archive', 
        onClick: () => archiveMutation.mutate(contact.id),
      });
    }

    if (canDelete('contacts')) {
      actions.push({ 
        label: 'Delete', 
        onClick: () => {
          if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteMutation.mutate(contact.id);
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
        title="Contacts"
        description="Manage your customer contacts"
        action={canCreate('contacts') ? {
          label: 'Add Contact',
          onClick: () => console.log('Add contact'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
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
              {error instanceof Error ? error.message : 'Failed to load contacts. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {contacts.map((contact) => (
                <DataCard
                  key={contact.id}
                  title={getDisplayName(contact)}
                  subtitle={contact.account_name || contact.job_title}
                  icon={
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {getInitials(contact)}
                    </div>
                  }
                  badges={
                    <>
                      <StatusBadge variant={getStatusVariant(contact.status as ContactStatus)}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </StatusBadge>
                      {contact.tags?.slice(0, 2).map((tag) => (
                        <StatusBadge key={tag} variant="muted">
                          {tag}
                        </StatusBadge>
                      ))}
                    </>
                  }
                  metadata={[
                    { label: 'Email', value: contact.email || 'N/A' },
                    { label: 'Owner', value: contact.owner_name || 'Unassigned' },
                    { label: 'Last Contact', value: formatDate(contact.last_contacted_at) },
                  ]}
                  onClick={() => console.log('View contact', contact.id)}
                  actions={getContactActions(contact)}
                />
              ))}
            </CardGrid>

            {/* Empty State */}
            {contacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <ContactIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No contacts found matching your search' : 'No contacts found'}
                </p>
                {!searchQuery && canCreate('contacts') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Add contact')}
                  >
                    Add your first contact
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {contactsData && contactsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {contacts.length} of {contactsData.total} contacts
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
