import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { roles as mockRoles, permissions as allPermissions } from '@/data/mockData';
import { Role, Permission } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CardSkeleton } from '@/components/ui/page-loader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Shield, ChevronDown, ChevronUp, Pencil, Trash2, Lock, Search } from 'lucide-react';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';

export default function Roles() {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
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
    permissions: [] as string[],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setRoles(mockRoles);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? '' : roleId);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_system: false,
      permissions: [],
    });
    setIsSheetOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      slug: role.slug,
      description: role.description,
      is_system: role.is_system,
      permissions: role.permissions || [],
    });
    setIsSheetOpen(true);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      // Update existing role
      setRoles(prev =>
        prev.map(r =>
          r.id === editingRole.id
            ? { ...r, ...formData }
            : r
        )
      );
    } else {
      // Create new role
      const newRole: Role = {
        id: `r-${Date.now()}`,
        ...formData,
        organization_id: 'org-1',
      };
      setRoles(prev => [...prev, newRole]);
    }
    setIsSheetOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const togglePermission = (permSlug: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permSlug)
        ? prev.permissions.filter(p => p !== permSlug)
        : [...prev.permissions, permSlug],
    }));
  };

  // Group permissions by module
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Get permission details for a role
  const getRolePermissionsByModule = (role: Role) => {
    const rolePerms = role.permissions || [];
    const modules: Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }> = {};
    
    allPermissions.forEach(perm => {
      if (!modules[perm.resource]) {
        modules[perm.resource] = { read: false, create: false, update: false, delete: false };
      }
      if (rolePerms.includes(perm.slug)) {
        modules[perm.resource][perm.action] = true;
      }
    });
    
    return Object.entries(modules).map(([resource, perms]) => ({
      resource: resource.charAt(0).toUpperCase() + resource.slice(1).replace('_', ' '),
      ...perms,
    }));
  };

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
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <CardSkeleton count={3} />
        ) : (
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
                      {getRolePermissionsByModule(role).map((perm, idx) => (
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
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredRoles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No roles found matching your search.
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
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sales Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  placeholder="e.g., sales_manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this role can do..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_system">System Role</Label>
                  <p className="text-xs text-muted-foreground">System roles cannot be deleted</p>
                </div>
                <Switch
                  id="is_system"
                  checked={formData.is_system}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_system: checked }))}
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <Label>Permissions</Label>
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{module}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {perms.map(perm => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={formData.permissions.includes(perm.slug)}
                          onCheckedChange={() => togglePermission(perm.slug)}
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
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={!formData.name || !formData.slug}>
              {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
