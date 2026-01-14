import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { users, organizations } from '@/data/mockData';
import { User } from '@/types';
import { UserCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserForm } from '@/components/forms/UserForm';

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.organizationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'god_admin': return 'destructive';
      case 'org_admin': return 'info';
      case 'agent': return 'muted';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users across all organizations"
        action={{
          label: 'Add User',
          onClick: handleAddUser,
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredUsers.map((user) => (
            <DataCard
              key={user.id}
              title={user.name}
              subtitle={user.email}
              icon={
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                  {getInitials(user.name)}
                </div>
              }
              badges={
                <StatusBadge variant={getRoleVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </StatusBadge>
              }
              metadata={[
                { label: 'Organization', value: user.organizationName || 'Platform' },
                { label: 'Created', value: new Date(user.createdAt).toLocaleDateString() },
              ]}
              onClick={() => handleEditUser(user)}
              actions={[
                { label: 'Edit', onClick: () => handleEditUser(user) },
                { label: 'Deactivate', onClick: () => console.log('Deactivate', user.id), destructive: true },
              ]}
            />
          ))}
        </CardGrid>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        isGodAdmin={true}
      />
    </div>
  );
}
