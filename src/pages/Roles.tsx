import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Shield, ChevronDown, ChevronUp, Pencil, Trash2, Lock, Search, 
  RefreshCw, AlertCircle, Loader2 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  useRoles, 
  useGroupedPermissions,
  useCreateRole, 
  useUpdateRole, 
  useDeleteRole,
} from '@/hooks/queries';
import type { Role, Permission, CreateRoleRequest, UpdateRoleRequest } from '@/services/roles';

export default function Roles() {
  const [expandedRole, setExpandedRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_system: false,
    permission_ids: [] as string[],
  });

  // API Hooks
  const { 
    data: rolesData, 
    isLoading: rolesLoading, 
    isError: rolesError, 
    error: rolesErrorMsg,
    refetch: refetchRoles 
  } = useRoles();
  
  const { 
    data: groupedPermissions, 
    isLoading: permsLoading 
  } = useGroupedPermissions();

  // Mutations
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const roles = rolesData?.items || [];
  const isLoading = rolesLoading || permsLoading;

  // Filter roles by search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleExpanded = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? '' : roleId);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_system: false,
      permission_ids: [],
    });
    setIsSheetOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      slug: role.slug,
      description: role.description || '',
      is_system: role.is_system,
      permission_ids: role.permissions?.map(p => p.id) || [],
    });
    setIsSheetOpen(true);
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        const updateData: UpdateRoleRequest = {
          name: formData.name,
          description: formData.description || undefined,
          permission_ids: formData.permission_ids,
        };
        await updateMutation.mutateAsync({ id: editingRole.id, data: updateData });
      } else {
        const createData: CreateRoleRequest = {
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '_'),
          description: formData.description || undefined,
          permission_ids: formData.permission_ids,
        };
        await createMutation.mutateAsync(createData);
      }
      setIsSheetOpen(false);
    } catch {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(roleId);
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permId)
        ? prev.permission_ids.filter(p => p !== permId)
        : [...prev.permission_ids, permId],
    }));
  };

  // Get permission matrix for a role
  const getRolePermissionMatrix = (role: Role) => {
    const rolePermIds = new Set(role.permissions?.map(p => p.id) || []);
    const matrix: Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }> = {};
    
    if (groupedPermissions) {
      Object.values(groupedPermissions).flat().forEach(perm => {
        if (!matrix[perm.resource]) {
          matrix[perm.resource] = { read: false, create: false, update: false, delete: false };
        }
        if (rolePermIds.has(perm.id)) {
          matrix[perm.resource][perm.action as keyof typeof matrix[string]] = true;
        }
      });
    }
    
    return Object.entries(matrix).map(([resource, perms]) => ({
      resource: resource.charAt(0).toUpperCase() + resource.slice(1).replace('_', ' '),
      ...perms,
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Manage user roles and their permissions"
        action={{
          label: 'Create Role',
          onClick: handleCreateRole,
        }}
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchRoles()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Error State */}
        {rolesError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {rolesErrorMsg instanceof Error ? rolesErrorMsg.message : 'Failed to load roles'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={3} />}

        {/* Roles List */}
        {!isLoading && !rolesError && (
          <div className="space-y-4">
            {filteredRoles.map((role, index) => (
              <Card 
                key={role.id} 
                className="animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleExpanded(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-md',
                        role.is_system ? 'bg-primary/10' : 'bg-secondary'
                      )}>
                        {role.is_system ? (
                          <Lock className="h-5 w-5 text-primary" />
                        ) : (
                          <Shield className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{role.name}</CardTitle>
                          {role.is_system && (
                            <StatusBadge variant="info">System</StatusBadge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Slug: <code className="bg-secondary px-1 rounded">{role.slug}</code>
                          {role.user_count !== undefined && (
                            <span className="ml-2">• {role.user_count} users</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!role.is_system && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRole(role);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {expandedRole === role.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedRole === role.id && (
                  <CardContent className="animate-fade-in">
                    <div className="rounded-md border border-border overflow-hidden">
                      {/* Permission Matrix Header */}
                      <div className="grid grid-cols-5 gap-4 bg-table-header px-4 py-3 text-xs font-medium text-muted-foreground">
                        <div>Resource</div>
                        <div className="text-center">Read</div>
                        <div className="text-center">Create</div>
                        <div className="text-center">Update</div>
                        <div className="text-center">Delete</div>
                      </div>

                      {/* Permission Matrix Rows */}
                      {getRolePermissionMatrix(role).map((perm, idx) => (
                        <div 
                          key={perm.resource}
                          className={cn(
                            'grid grid-cols-5 gap-4 px-4 py-3 text-sm',
                            idx % 2 === 0 ? 'bg-background' : 'bg-secondary/30'
                          )}
                        >
                          <div className="font-medium">{perm.resource}</div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={perm.read} 
                              disabled
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={perm.create} 
                              disabled
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={perm.update} 
                              disabled
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={perm.delete} 
                              disabled
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                          </div>
                        </div>
                      ))}

                      {getRolePermissionMatrix(role).length === 0 && (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                          No permissions assigned to this role
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredRoles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? 'No roles found matching your search.' : 'No roles found.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRole ? 'Edit Role' : 'Create Role'}</SheetTitle>
            <SheetDescription>
              {editingRole ? 'Update role details and permissions' : 'Create a new role with custom permissions'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sales Manager"
                  disabled={isPending}
                />
              </div>

              {!editingRole && (
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                    }))}
                    placeholder="e.g., sales_manager"
                    disabled={isPending}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this role can do..."
                  rows={3}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <Label>Permissions</Label>
              {permsLoading ? (
                <div className="py-4 text-center text-muted-foreground">
                  Loading permissions...
                </div>
              ) : groupedPermissions && Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{module}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {perms.map(perm => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={formData.permission_ids.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                          disabled={isPending}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{perm.name}</p>
                          <p className="text-xs text-muted-foreground">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSheetOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRole} 
              disabled={!formData.name || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingRole ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingRole ? 'Update Role' : 'Create Role'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
