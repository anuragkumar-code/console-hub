import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { contacts } from '@/data/mockData';
import { Contact, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePermission } from '@/hooks/usePermission';

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build actions array based on permissions
  const getContactActions = (contactId: string) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [
      { label: 'View Details', onClick: () => console.log('View', contactId) },
    ];

    if (canUpdate('contacts')) {
      actions.push({ label: 'Edit', onClick: () => console.log('Edit', contactId) });
    }

    if (canDelete('contacts')) {
      actions.push({ label: 'Delete', onClick: () => console.log('Delete', contactId), destructive: true });
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredContacts.map((contact) => (
            <DataCard
              key={contact.id}
              title={contact.name}
              subtitle={contact.company}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
              }
              badges={
                <>
                  <StatusBadge variant={getStatusVariant(contact.status)}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </StatusBadge>
                  {contact.tags.slice(0, 2).map((tag) => (
                    <StatusBadge key={tag} variant="muted">
                      {tag}
                    </StatusBadge>
                  ))}
                </>
              }
              metadata={[
                { label: 'Email', value: contact.email },
                { label: 'Owner', value: contact.owner },
              ]}
              onClick={() => console.log('View contact', contact.id)}
              actions={getContactActions(contact.id)}
            />
          ))}
        </CardGrid>

        {filteredContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Contact className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
