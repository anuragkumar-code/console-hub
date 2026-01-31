import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { UserCircle, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { UserForm } from '@/components/forms/UserForm';
import { 
  useUsers, 
  useDeactivateUser,
  useActivateUser,
  useDeleteUser,
} from '@/hooks/queries';
import type { User, UserStatus } from '@/services/users';

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users from API
  const { 
    data: usersData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useUsers({ search: searchQuery || undefined });

  // Mutations
  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const deleteMutation = useDeleteUser();

  // Get users list
  const users = usersData?.items || [];

  const getStatusVariantForUser = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'muted';
      case 'pending': return 'warning';
      case 'suspended': return 'destructive';
      default: return 'default';
    }
  };

  const getRoleVariant = (roleSlug: string) => {
    switch (roleSlug) {
      case 'god_admin':
      case 'super_admin':
      case 'platform_admin':
        return 'destructive';
      case 'org_admin':
        return 'info';
      case 'agent':
        return 'muted';
      default: return 'default';
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    if (user.status === 'active') {
      deactivateMutation.mutate(user.id);
    } else {
      activateMutation.mutate(user.id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getDisplayName = (user: User) => {
    return user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.first_name;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
              {error instanceof Error ? error.message : 'Failed to load users. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {users.map((user) => (
                <DataCard
                  key={user.id}
                  title={getDisplayName(user)}
                  subtitle={user.email}
                  icon={
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                  }
                  badges={
                    <>
                      <StatusBadge variant={getStatusVariantForUser(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </StatusBadge>
                      {user.role && (
                        <StatusBadge variant={getRoleVariant(user.role.slug)}>
                          {user.role.name}
                        </StatusBadge>
                      )}
                    </>
                  }
                  metadata={[
                    { label: 'Organization', value: user.organization_name || 'Platform' },
                    { label: 'Created', value: formatDate(user.created_at) },
                  ]}
                  onClick={() => handleEditUser(user)}
                  actions={[
                    { label: 'Edit', onClick: () => handleEditUser(user) },
                    { 
                      label: user.status === 'active' ? 'Deactivate' : 'Activate', 
                      onClick: () => handleToggleStatus(user),
                      destructive: user.status === 'active',
                    },
                    { 
                      label: 'Delete', 
                      onClick: () => handleDelete(user.id), 
                      destructive: true 
                    },
                  ]}
                />
              ))}
            </CardGrid>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No users found matching your search' : 'No users found'}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleAddUser}
                  >
                    Add your first user
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {usersData && usersData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {users.length} of {usersData.total} users
              </div>
            )}
          </>
        )}
      </div>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
      />
    </div>
  );
}
