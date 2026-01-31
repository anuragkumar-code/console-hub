import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, Save, RefreshCw } from 'lucide-react';
import {
  useOrganizationSettings,
  useUpdateGeneralSettings,
  useUpdateNotificationSettings,
  useUpdateSecuritySettings,
} from '@/hooks/queries';
import type { GeneralSettings, NotificationSettings, SecuritySettings } from '@/services/settings';

export default function Settings() {
  const { user, hasPermission } = useAuth();
  
  // Fetch all settings
  const { 
    data: settings, 
    isLoading, 
    isError, 
    refetch 
  } = useOrganizationSettings();

  // Update mutations
  const updateGeneralMutation = useUpdateGeneralSettings();
  const updateNotificationsMutation = useUpdateNotificationSettings();
  const updateSecurityMutation = useUpdateSecuritySettings();

  // Form state
  const [generalForm, setGeneralForm] = useState<Partial<GeneralSettings>>({});
  const [notificationForm, setNotificationForm] = useState<Partial<NotificationSettings>>({});
  const [securityForm, setSecurityForm] = useState<Partial<SecuritySettings>>({});

  // Update form state when settings load
  useEffect(() => {
    if (settings) {
      setGeneralForm(settings.general);
      setNotificationForm(settings.notifications);
      setSecurityForm(settings.security);
    }
  }, [settings]);

  const canEditSettings = hasPermission('settings.update');

  const handleGeneralSave = () => {
    updateGeneralMutation.mutate(generalForm);
  };

  const handleNotificationsSave = () => {
    updateNotificationsMutation.mutate(notificationForm);
  };

  const handleSecuritySave = () => {
    updateSecurityMutation.mutate(securityForm);
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Settings"
          description="Manage organization settings and preferences"
        />
        <div className="p-6 max-w-3xl space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <PageHeader
          title="Settings"
          description="Manage organization settings and preferences"
        />
        <div className="p-6 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load settings. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage organization settings and preferences"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </PageHeader>

      <div className="p-6 max-w-3xl space-y-6">
        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Information</CardTitle>
            <CardDescription>General information about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName" 
                  value={generalForm.name || ''} 
                  onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  value={generalForm.slug || ''} 
                  disabled
                  className="text-muted-foreground"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={generalForm.email || ''} 
                  onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={generalForm.phone || ''} 
                  onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={generalForm.website || ''} 
                onChange={(e) => setGeneralForm({ ...generalForm, website: e.target.value })}
                disabled={!canEditSettings}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={generalForm.timezone || 'UTC'} 
                  onValueChange={(value) => setGeneralForm({ ...generalForm, timezone: value })}
                  disabled={!canEditSettings}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={generalForm.currency || 'USD'} 
                  onValueChange={(value) => setGeneralForm({ ...generalForm, currency: value })}
                  disabled={!canEditSettings}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={generalForm.language || 'en'} 
                  onValueChange={(value) => setGeneralForm({ ...generalForm, language: value })}
                  disabled={!canEditSettings}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {canEditSettings && (
              <Button 
                onClick={handleGeneralSave}
                disabled={updateGeneralMutation.isPending}
              >
                {updateGeneralMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Configure notification preferences for your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive email alerts for important events</p>
              </div>
              <Switch 
                checked={notificationForm.email_notifications ?? true}
                onCheckedChange={(checked) => 
                  setNotificationForm({ ...notificationForm, email_notifications: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Ticket Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when new tickets are created</p>
              </div>
              <Switch 
                checked={notificationForm.notify_new_ticket ?? true}
                onCheckedChange={(checked) => 
                  setNotificationForm({ ...notificationForm, notify_new_ticket: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Ticket Assignment Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when tickets are assigned to your team</p>
              </div>
              <Switch 
                checked={notificationForm.notify_ticket_assigned ?? true}
                onCheckedChange={(checked) => 
                  setNotificationForm({ ...notificationForm, notify_ticket_assigned: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Deal Notifications</p>
                <p className="text-xs text-muted-foreground">Alerts for new, won, and lost deals</p>
              </div>
              <Switch 
                checked={notificationForm.notify_new_deal ?? true}
                onCheckedChange={(checked) => 
                  setNotificationForm({ ...notificationForm, notify_new_deal: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Digest</p>
                <p className="text-xs text-muted-foreground">Receive a daily summary email</p>
              </div>
              <Switch 
                checked={notificationForm.daily_digest ?? false}
                onCheckedChange={(checked) => 
                  setNotificationForm({ ...notificationForm, daily_digest: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            {canEditSettings && (
              <Button 
                onClick={handleNotificationsSave}
                disabled={updateNotificationsMutation.isPending}
                className="mt-2"
              >
                {updateNotificationsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
            <CardDescription>Security settings for your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
              </div>
              <Switch 
                checked={securityForm.two_factor_enabled ?? false}
                onCheckedChange={(checked) => 
                  setSecurityForm({ ...securityForm, two_factor_enabled: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require Strong Passwords</p>
                <p className="text-xs text-muted-foreground">Enforce strong password requirements</p>
              </div>
              <Switch 
                checked={securityForm.require_strong_password ?? true}
                onCheckedChange={(checked) => 
                  setSecurityForm({ ...securityForm, require_strong_password: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  id="sessionTimeout" 
                  type="number"
                  min={5}
                  max={480}
                  value={securityForm.session_timeout || 60} 
                  onChange={(e) => setSecurityForm({ 
                    ...securityForm, 
                    session_timeout: parseInt(e.target.value) || 60 
                  })}
                  disabled={!canEditSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input 
                  id="passwordExpiry" 
                  type="number"
                  min={0}
                  max={365}
                  value={securityForm.password_expiry_days || 90} 
                  onChange={(e) => setSecurityForm({ 
                    ...securityForm, 
                    password_expiry_days: parseInt(e.target.value) || 90 
                  })}
                  disabled={!canEditSettings}
                />
                <p className="text-xs text-muted-foreground">Set to 0 to disable password expiry</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input 
                  id="loginAttempts" 
                  type="number"
                  min={3}
                  max={10}
                  value={securityForm.login_attempts_limit || 5} 
                  onChange={(e) => setSecurityForm({ 
                    ...securityForm, 
                    login_attempts_limit: parseInt(e.target.value) || 5 
                  })}
                  disabled={!canEditSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                <Input 
                  id="lockoutDuration" 
                  type="number"
                  min={5}
                  max={60}
                  value={securityForm.lockout_duration || 15} 
                  onChange={(e) => setSecurityForm({ 
                    ...securityForm, 
                    lockout_duration: parseInt(e.target.value) || 15 
                  })}
                  disabled={!canEditSettings}
                />
              </div>
            </div>
            {canEditSettings && (
              <Button 
                onClick={handleSecuritySave}
                disabled={updateSecurityMutation.isPending}
                className="mt-2"
              >
                {updateSecurityMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Security Settings
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
