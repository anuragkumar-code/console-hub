import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { roles } from '@/data/mockData';
import { Role, Permission } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [expandedRole, setExpandedRole] = useState<string>(roles[0].id);

  const toggleExpanded = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? '' : roleId);
  };

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Manage access control and permissions"
        action={{
          label: 'Create Role',
          onClick: () => console.log('Create role'),
        }}
      />

      <div className="p-6 space-y-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleExpanded(role.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit role', role.id);
                  }}>
                    Edit
                  </Button>
                  {expandedRole === role.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedRole === role.id && (
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  {/* Permission Matrix Header */}
                  <div className="grid grid-cols-5 gap-4 bg-table-header px-4 py-3 text-xs font-medium text-muted-foreground">
                    <div>Module</div>
                    <div className="text-center">Read</div>
                    <div className="text-center">Create</div>
                    <div className="text-center">Update</div>
                    <div className="text-center">Delete</div>
                  </div>

                  {/* Permission Matrix Rows */}
                  {role.permissions.map((permission, index) => (
                    <div 
                      key={permission.module}
                      className={cn(
                        'grid grid-cols-5 gap-4 px-4 py-3 text-sm',
                        index % 2 === 0 ? 'bg-background' : 'bg-secondary/30'
                      )}
                    >
                      <div className="font-medium">{permission.module}</div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permission.read} 
                          disabled
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permission.create} 
                          disabled
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permission.update} 
                          disabled
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permission.delete} 
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
      </div>
    </div>
  );
}
