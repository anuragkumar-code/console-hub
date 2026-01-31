import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, Save, RefreshCw, Camera } from 'lucide-react';
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
} from '@/hooks/queries';
import type { UpdateProfileRequest, ChangePasswordRequest } from '@/services/settings';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile
  const { 
    data: profile, 
    isLoading, 
    isError, 
    refetch 
  } = useProfile();

  // Update mutations
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();

  // Form state
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({});
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Update form state when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name,
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        timezone: profile.timezone || 'UTC',
        language: profile.language || 'en',
        notifications: profile.notifications,
      });
    }
  }, [profile]);

  const initials = profile
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase()
    : user?.firstName?.[0]?.toUpperCase() || 'U';

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordChange = () => {
    setPasswordError(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Only JPG, PNG, or GIF files are allowed');
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Profile"
          description="Manage your account settings"
        />
        <div className="p-6 max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <PageHeader
          title="Profile"
          description="Manage your account settings"
        />
        <div className="p-6 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile. Please try again.
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
        title="Profile"
        description="Manage your account settings"
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
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  disabled={uploadAvatarMutation.isPending}
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-muted-foreground">Click the camera icon to change photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileForm.first_name || ''} 
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileForm.last_name || ''} 
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled 
                  className="text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={profileForm.phone || ''} 
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role" 
                value={user?.role?.name || 'User'} 
                disabled 
                className="text-muted-foreground"
              />
            </div>

            <Button 
              onClick={handleProfileSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                />
              </div>
            </div>
            <Button 
              onClick={handlePasswordChange}
              disabled={changePasswordMutation.isPending || !passwordForm.current_password || !passwordForm.new_password}
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={profileForm.timezone || 'UTC'} 
                  onValueChange={(value) => setProfileForm({ ...profileForm, timezone: value })}
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
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={profileForm.language || 'en'} 
                  onValueChange={(value) => setProfileForm({ ...profileForm, language: value })}
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

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Preferences</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={profileForm.notifications?.email ?? true}
                  onCheckedChange={(checked) => 
                    setProfileForm({ 
                      ...profileForm, 
                      notifications: { ...profileForm.notifications, email: checked } 
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch 
                  checked={profileForm.notifications?.push ?? true}
                  onCheckedChange={(checked) => 
                    setProfileForm({ 
                      ...profileForm, 
                      notifications: { ...profileForm.notifications, push: checked } 
                    })
                  }
                />
              </div>
            </div>

            <Button 
              onClick={handleProfileSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
