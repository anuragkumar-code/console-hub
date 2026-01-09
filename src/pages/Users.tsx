import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { users } from '@/data/mockData';
import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';

export default function Users() {
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

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{user.name}</span>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        <StatusBadge variant={getRoleVariant(user.role)}>
          {getRoleLabel(user.role)}
        </StatusBadge>
      ),
    },
    {
      key: 'organizationName',
      label: 'Organization',
      render: (user) => (
        <span className="text-sm">{user.organizationName || 'Platform'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users across all organizations"
        action={{
          label: 'Add User',
          onClick: () => console.log('Add user'),
        }}
      />

      <div className="p-6">
        <DataTable
          data={users}
          columns={columns}
          onRowClick={(user) => console.log('View user', user.id)}
          emptyMessage="No users found"
        />
      </div>
    </div>
  );
}
