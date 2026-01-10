import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { permissions as mockPermissions } from '@/data/mockData';
import { Permission } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TableSkeleton } from '@/components/ui/page-loader';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Pencil, Trash2, Lock } from 'lucide-react';

export default function Permissions() {
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    resource: '',
    action: 'read' as Permission['action'],
    description: '',
    module: '',
    is_system: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPermissions(mockPermissions);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const modules = [...new Set(permissions.map(p => p.module))];

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = 
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || perm.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleCreatePermission = () => {
    setEditingPermission(null);
    setFormData({
      name: '',
      slug: '',
      resource: '',
      action: 'read',
      description: '',
      module: '',
      is_system: false,
    });
    setIsSheetOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      slug: permission.slug,
      resource: permission.resource,
      action: permission.action,
      description: permission.description,
      module: permission.module,
      is_system: permission.is_system,
    });
    setIsSheetOpen(true);
  };

  const handleSavePermission = () => {
    if (editingPermission) {
      setPermissions(prev =>
        prev.map(p =>
          p.id === editingPermission.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newPermission: Permission = {
        id: `p-${Date.now()}`,
        ...formData,
      };
      setPermissions(prev => [...prev, newPermission]);
    }
    setIsSheetOpen(false);
  };

  const handleDeletePermission = (permissionId: string) => {
    setPermissions(prev => prev.filter(p => p.id !== permissionId));
  };

  const actionVariants: Record<Permission['action'], 'info' | 'success' | 'warning' | 'destructive'> = {
    read: 'info',
    create: 'success',
    update: 'warning',
    delete: 'destructive',
  };

  const columns: Column<Permission>[] = [
    {
      key: 'name',
      label: 'Permission',
      render: (perm) => (
        <div className="flex items-center gap-2">
          {perm.is_system && <Lock className="h-3 w-3 text-muted-foreground" />}
          <div>
            <p className="font-medium">{perm.name}</p>
            <code className="text-xs text-muted-foreground bg-secondary px-1 rounded">{perm.slug}</code>
          </div>
        </div>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (perm) => (
        <span className="capitalize">{perm.resource.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (perm) => (
        <StatusBadge variant={actionVariants[perm.action]}>
          {perm.action.toUpperCase()}
        </StatusBadge>
      ),
    },
    {
      key: 'module',
      label: 'Module',
      render: (perm) => (
        <span className="text-sm text-muted-foreground">{perm.module}</span>
      ),
    },
    {
      key: 'is_system',
      label: 'Type',
      render: (perm) => (
        <StatusBadge variant={perm.is_system ? 'info' : 'default'}>
          {perm.is_system ? 'System' : 'Custom'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (perm) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPermission(perm);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {!perm.is_system && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePermission(perm.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Permissions"
        description="Manage granular access control permissions"
        action={{
          label: 'Create Permission',
          onClick: handleCreatePermission,
        }}
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map(module => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : (
          <div className="animate-fade-in">
            <DataTable
              data={filteredPermissions}
              columns={columns}
              emptyMessage="No permissions found"
            />
          </div>
        )}
      </div>

      {/* Permission Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingPermission ? 'Edit Permission' : 'Create Permission'}</SheetTitle>
            <SheetDescription>
              {editingPermission ? 'Update permission details' : 'Create a new permission for access control'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., View Contacts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '.') }))}
                placeholder="e.g., contacts.read"
              />
              <p className="text-xs text-muted-foreground">Format: resource.action</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource">Resource</Label>
                <Input
                  id="resource"
                  value={formData.resource}
                  onChange={(e) => setFormData(prev => ({ ...prev, resource: e.target.value.toLowerCase() }))}
                  placeholder="e.g., contacts"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select 
                  value={formData.action} 
                  onValueChange={(value: Permission['action']) => setFormData(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Input
                id="module"
                value={formData.module}
                onChange={(e) => setFormData(prev => ({ ...prev, module: e.target.value }))}
                placeholder="e.g., CRM, Admin, Support"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this permission allows..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_system">System Permission</Label>
                <p className="text-xs text-muted-foreground">System permissions cannot be deleted</p>
              </div>
              <Switch
                id="is_system"
                checked={formData.is_system}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_system: checked }))}
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePermission} 
              disabled={!formData.name || !formData.slug || !formData.resource || !formData.module}
            >
              {editingPermission ? 'Update Permission' : 'Create Permission'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
