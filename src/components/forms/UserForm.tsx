import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Pencil, Loader2, AlertCircle } from 'lucide-react';
import { useCreateUser, useUpdateUser, useRoles, useOrganizations } from '@/hooks/queries';
import { useAuth } from '@/contexts/AuthContext';
import type { User, CreateUserRequest, UpdateUserRequest, UserStatus } from '@/services/users';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().optional(),
  role_id: z.string().min(1, 'Please select a role'),
  organization_id: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  send_invite: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

export function UserForm({ open, onOpenChange, user }: UserFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { isGodAdmin } = useAuth();
  const isEditing = !!user;

  // Fetch roles and organizations
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: orgsData, isLoading: orgsLoading } = useOrganizations();

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const roles = rolesData?.items || [];
  const organizations = orgsData?.items || [];

  // Filter roles based on context (non-god admins shouldn't assign god_admin role)
  const availableRoles = isGodAdmin 
    ? roles 
    : roles.filter(r => !['super_admin', 'god_admin', 'platform_admin'].includes(r.slug));

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      first_name: '',
      last_name: '',
      role_id: '',
      organization_id: '',
      status: 'active',
      send_invite: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        phone: user.phone || '',
        password: '',
        first_name: user.first_name,
        last_name: user.last_name || '',
        role_id: user.role_id,
        organization_id: user.organization_id || '',
        status: user.status,
        send_invite: false,
      });
    } else {
      form.reset({
        email: '',
        phone: '',
        password: '',
        first_name: '',
        last_name: '',
        role_id: '',
        organization_id: '',
        status: 'active',
        send_invite: true,
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UserFormValues) => {
    setError(null);

    try {
      if (isEditing && user) {
        // Update user
        const updateData: UpdateUserRequest = {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name || undefined,
          phone: data.phone || undefined,
          role_id: data.role_id,
          status: data.status,
        };
        await updateMutation.mutateAsync({ id: user.id, data: updateData });
      } else {
        // Create user
        const createData: CreateUserRequest = {
          email: data.email,
          password: data.password || undefined,
          first_name: data.first_name,
          last_name: data.last_name || undefined,
          phone: data.phone || undefined,
          role_id: data.role_id,
          organization_id: data.organization_id || undefined,
          status: data.status,
          send_invite: data.send_invite,
        };
        await createMutation.mutateAsync(createData);
      }

      // Reset form and close on success
      form.reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLoading = rolesLoading || orgsLoading;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="h-5 w-5" />
                Edit User
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Add New User
              </>
            )}
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? 'Update user details below.' 
              : 'Fill in the details to create a new user.'}
          </SheetDescription>
        </SheetHeader>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John" 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Doe" 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        {...field} 
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        {...field} 
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Security */}
            {!isEditing && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Security</h3>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Leave blank to send invite"
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Role & Organization */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Role & Organization</h3>
              
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isPending || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={rolesLoading ? 'Loading roles...' : 'Select a role'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isGodAdmin && (
                <FormField
                  control={form.control}
                  name="organization_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isPending || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={orgsLoading ? 'Loading orgs...' : 'Select an organization'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Platform User (No Organization)</SelectItem>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isPending || isLoading}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update User' : 'Create User'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
