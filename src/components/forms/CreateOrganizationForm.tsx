import { useState } from 'react';
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
  FormDescription,
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
import { Building2, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/queries';
import type { CreateOrganizationRequest, PlanType } from '@/services/organizations';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  plan_type: z.enum(['free', 'trial', 'starter', 'professional', 'enterprise']),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  max_users: z.coerce.number().optional(),
  max_storage: z.coerce.number().optional(),
  date_format: z.string().optional(),
  industry: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface CreateOrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const planTypes: { value: PlanType; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'trial', label: 'Trial' },
  { value: 'starter', label: 'Starter' },
  { value: 'professional', label: 'Professional' },
  { value: 'enterprise', label: 'Enterprise' },
];

const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'other', label: 'Other' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CAD', label: 'CAD (C$)' },
];

const maxUsersOptions = [
  { value: 10, label: '10 users' },
  { value: 25, label: '25 users' },
  { value: 50, label: '50 users' },
  { value: 100, label: '100 users' },
  { value: 250, label: '250 users' },
  { value: 500, label: '500 users' },
  { value: 1000, label: '1,000 users' },
];

const maxStorageOptions = [
  { value: 1, label: '1 GB' },
  { value: 5, label: '5 GB' },
  { value: 10, label: '10 GB' },
  { value: 25, label: '25 GB' },
  { value: 50, label: '50 GB' },
  { value: 100, label: '100 GB' },
  { value: 250, label: '250 GB' },
  { value: 500, label: '500 GB' },
  { value: 1000, label: '1 TB' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export function CreateOrganizationForm({ open, onOpenChange }: CreateOrganizationFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateOrganization();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      plan_type: 'trial',
      email: '',
      phone: '',
      website: '',
      timezone: 'UTC',
      currency: 'USD',
      max_users: 10,
      max_storage: 5,
      date_format: 'YYYY-MM-DD',
      industry: '',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  const handleSubmit = async (data: OrganizationFormValues) => {
    setError(null);

    // Transform form data to API request format
    const requestData: CreateOrganizationRequest = {
      name: data.name,
      plan_type: data.plan_type as PlanType,
      email: data.email || undefined,
      phone: data.phone || undefined,
      website: data.website || undefined,
      timezone: data.timezone,
      currency: data.currency,
      max_users: data.max_users,
      max_storage: data.max_storage,
      date_format: data.date_format,
      industry: data.industry || undefined,
    };

    try {
      await createMutation.mutateAsync(requestData);
      
      // Reset form and close on success
      form.reset();
      setLogoPreview(null);
      onOpenChange(false);
    } catch (err) {
      // Error is handled by the mutation's onError callback
      // But we can also show it in the form
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    }
  };

  const handleClose = () => {
    form.reset();
    setLogoPreview(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Organization
          </SheetTitle>
          <SheetDescription>
            Add a new organization to the platform. Fill in the details below.
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter organization name" 
                        {...field} 
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={createMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {planTypes.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={createMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo Upload */}
              <div className="space-y-2">
                <FormLabel>Logo</FormLabel>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1"
                        disabled={createMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        disabled={createMutation.isPending}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 2MB
                  </p>
                </div>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="org@example.com" 
                        {...field} 
                        disabled={createMutation.isPending}
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
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com" 
                        {...field} 
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Limits */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Limits & Quotas</h3>
              
              <FormField
                control={form.control}
                name="max_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Users</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(parseInt(val))} 
                      defaultValue={field.value?.toString()}
                      disabled={createMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user limit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maxUsersOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Maximum number of users allowed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Storage</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(parseInt(val))} 
                      defaultValue={field.value?.toString()}
                      disabled={createMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage limit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maxStorageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Maximum storage allocation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
              
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={createMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={createMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Format</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={createMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dateFormats.map((fmt) => (
                            <SelectItem key={fmt.value} value={fmt.value}>
                              {fmt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Organization'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
