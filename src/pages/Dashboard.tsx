import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Users, 
  Contact, 
  Briefcase, 
  Ticket, 
  HandshakeIcon,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  usePlatformOverview, 
  useOrganizationOverview,
  useRecentActivity,
} from '@/hooks/queries';

export default function Dashboard() {
  const { user, isGodAdmin, setUserRole } = useAuth();

  // Fetch dashboard data based on role
  const { 
    data: platformData, 
    isLoading: platformLoading, 
    isError: platformError,
    refetch: refetchPlatform,
  } = usePlatformOverview();

  const { 
    data: orgData, 
    isLoading: orgLoading, 
    isError: orgError,
    refetch: refetchOrg,
  } = useOrganizationOverview();

  const {
    data: activityData,
    isLoading: activityLoading,
  } = useRecentActivity(5);

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Loading skeleton
  const StatSkeleton = () => (
    <div className="rounded-lg border border-border p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );

  // God Admin Dashboard
  if (isGodAdmin) {
    const stats = platformData?.stats;
    const recentOrgs = platformData?.recent_organizations || [];
    const activity = activityData || platformData?.recent_activity || [];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">Platform Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back. Here's what's happening across the platform.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchPlatform()}
              disabled={platformLoading}
            >
              <RefreshCw className={`h-4 w-4 ${platformLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* Role Switcher for Testing */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">Test Role (Dev Mode)</span>
              <Select
                value={user?.role?.slug || 'org_admin'}
                onValueChange={(value) => setUserRole(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="god_admin">God Admin</SelectItem>
                  <SelectItem value="org_admin">Org Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {platformError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Organizations"
                value={stats?.total_organizations?.toString() || '0'}
                change={stats?.organizations_this_month ? { 
                  value: `${stats.organizations_this_month} this month`, 
                  positive: true 
                } : undefined}
                icon={<Building2 className="h-5 w-5" />}
              />
              <StatCard
                title="Total Users"
                value={stats?.total_users?.toString() || '0'}
                change={stats?.users_growth ? { 
                  value: `${stats.users_growth}% vs last month`, 
                  positive: stats.users_growth > 0 
                } : undefined}
                icon={<Users className="h-5 w-5" />}
              />
              <StatCard
                title="Active Organizations"
                value={stats?.active_organizations?.toString() || '0'}
                icon={<MessageSquare className="h-5 w-5" />}
              />
              <StatCard
                title="System Uptime"
                value={stats?.api_uptime ? `${stats.api_uptime}%` : '99.9%'}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Organizations */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold mb-4">Recent Organizations</h2>
            {platformLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrgs.length > 0 ? recentOrgs.map((org, index) => (
                  <div key={org.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.plan_type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(org.created_at)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No recent organizations
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="text-base font-semibold mb-4">Recent Activity</h2>
            {activityLoading || platformLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {activity.length > 0 ? activity.map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(item.created_at)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No recent activity
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Org Admin / Agent Dashboard
  const stats = orgData?.stats;
  const charts = orgData?.charts;
  const activity = orgData?.recent_activity || activityData || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {getUserDisplayName()}. Here's an overview of your workspace.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchOrg()}
            disabled={orgLoading}
          >
            <RefreshCw className={`h-4 w-4 ${orgLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          {/* Role Switcher for Testing */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">Test Role (Dev Mode)</span>
            <Select
              value={user?.role?.slug || 'org_admin'}
              onValueChange={(value) => setUserRole(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="god_admin">God Admin</SelectItem>
                <SelectItem value="org_admin">Org Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {orgError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orgLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Contacts"
              value={stats?.total_contacts?.toString() || '0'}
              change={stats?.contacts_this_month ? { 
                value: `${stats.contacts_this_month} this week`, 
                positive: true 
              } : undefined}
              icon={<Contact className="h-5 w-5" />}
            />
            <StatCard
              title="Active Accounts"
              value={stats?.total_accounts?.toString() || '0'}
              icon={<Briefcase className="h-5 w-5" />}
            />
            <StatCard
              title="Open Tickets"
              value={stats?.open_tickets?.toString() || '0'}
              change={stats?.sla_compliance ? { 
                value: `${stats.sla_compliance}% SLA`, 
                positive: stats.sla_compliance >= 90 
              } : undefined}
              icon={<Ticket className="h-5 w-5" />}
            />
            <StatCard
              title="Pipeline Value"
              value={formatCurrency(stats?.deals_value)}
              change={stats?.conversion_rate ? { 
                value: `${stats.conversion_rate}% conversion`, 
                positive: true 
              } : undefined}
              icon={<DollarSign className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deals by Stage */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Pipeline Overview</h2>
          {orgLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {charts?.deals_by_stage && charts.deals_by_stage.length > 0 ? 
                charts.deals_by_stage.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{item.stage.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{item.count} deals</p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No deals data available
                  </p>
                )
              }
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Recent Activity</h2>
          {orgLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {activity.length > 0 ? activity.slice(0, 5).map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(item.created_at)}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent activity
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
