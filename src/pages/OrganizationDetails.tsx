import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  organizations, users, tickets, deals, channels, teams 
} from '@/data/mockData';
import { 
  Building2, Users, Ticket, DollarSign, MessageSquare, 
  UsersRound, ArrowLeft, Mail, Phone, Globe, Calendar,
  HardDrive, Clock, CreditCard, TrendingUp, AlertTriangle, CheckCircle2
} from 'lucide-react';

// Skeleton loader component for the page
function OrganizationDetailsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Status Card Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const organization = organizations.find(org => org.id === id);

  // Mock data - in real app, these would be filtered by organization
  const orgUsers = users.filter(u => u.organizationId === id || Math.random() > 0.5).slice(0, 5);
  const orgTickets = tickets.slice(0, 4);
  const orgDeals = deals.slice(0, 4);
  const orgChannels = channels.slice(0, 3);
  const orgTeams = teams.slice(0, 3);

  // Calculate stats
  const activeUsers = orgUsers.filter(u => u.role !== 'god_admin').length;
  const openTickets = orgTickets.filter(t => t.status === 'open').length;
  const totalDealValue = orgDeals.reduce((sum, d) => sum + d.value, 0);
  const activeChannels = orgChannels.filter(c => c.status === 'active').length;
  const slaBreached = orgTickets.filter(t => t.slaBreached).length;
  const resolvedTickets = orgTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  useEffect(() => {
    if (organization) {
      setIsActive(organization.status === 'active');
    }
  }, [organization]);

  if (isLoading) {
    return <OrganizationDetailsSkeleton />;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Organization Not Found</h2>
        <p className="text-muted-foreground">The organization you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/organizations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </div>
    );
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'info';
      case 'professional': return 'success';
      case 'starter': return 'warning';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={organization.name}
        description={organization.industry || 'Organization Details'}
      >
        <Button variant="outline" onClick={() => navigate('/organizations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <div className="px-6 space-y-6">
        {/* Status Toggle Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{organization.name}</h3>
                    <StatusBadge variant={getStatusVariant(isActive ? 'active' : 'inactive')}>
                      {isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                    <StatusBadge variant={getPlanBadgeVariant(organization.plan)}>
                      {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Toggle to activate or deactivate this organization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  aria-label="Toggle organization status"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={organization.userCount}
            icon={<Users className="h-5 w-5" />}
            change={{ value: '+3 this month', positive: true }}
          />
          <StatCard
            title="Open Tickets"
            value={openTickets}
            icon={<Ticket className="h-5 w-5" />}
            change={{ value: `${slaBreached} SLA breached`, positive: false }}
          />
          <StatCard
            title="Deal Pipeline"
            value={`$${(totalDealValue / 1000).toFixed(0)}K`}
            icon={<DollarSign className="h-5 w-5" />}
            change={{ value: '+12% this quarter', positive: true }}
          />
          <StatCard
            title="Active Channels"
            value={activeChannels}
            icon={<MessageSquare className="h-5 w-5" />}
            change={{ value: `${orgChannels.length} total`, positive: true }}
          />
        </div>

        {/* Organization Details & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </span>
                <span className="text-sm font-medium">contact@{organization.name.toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </span>
                <span className="text-sm font-medium">+1 (555) 123-4567</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Website
                </span>
                <span className="text-sm font-medium text-primary">www.{organization.name.toLowerCase().replace(/\s+/g, '')}.com</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Created
                </span>
                <span className="text-sm font-medium">{new Date(organization.createdAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Industry
                </span>
                <span className="text-sm font-medium">{organization.industry || 'Not specified'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Plan & Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                Plan & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Current Plan
                </span>
                <StatusBadge variant={getPlanBadgeVariant(organization.plan)}>
                  {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}
                </StatusBadge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Max Users
                </span>
                <span className="text-sm font-medium">{organization.plan === 'enterprise' ? 'Unlimited' : organization.plan === 'professional' ? '100' : '25'}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <HardDrive className="h-4 w-4" /> Storage Used
                </span>
                <span className="text-sm font-medium">12.5 GB / 50 GB</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Timezone
                </span>
                <span className="text-sm font-medium">UTC-5 (EST)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resolvedTickets}</p>
                  <p className="text-xs text-muted-foreground">Tickets Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{slaBreached}</p>
                  <p className="text-xs text-muted-foreground">SLA Breached</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orgDeals.filter(d => d.stage === 'closed_won').length}</p>
                  <p className="text-xs text-muted-foreground">Deals Won</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <UsersRound className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orgTeams.length}</p>
                  <p className="text-xs text-muted-foreground">Active Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams & Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-muted-foreground" />
                Teams ({orgTeams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orgTeams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <UsersRound className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.memberCount} members</p>
                      </div>
                    </div>
                    <StatusBadge variant="success">Active</StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                Channels ({orgChannels.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orgChannels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{channel.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{channel.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <StatusBadge variant={getStatusVariant(channel.status)}>
                      {channel.status.charAt(0).toUpperCase() + channel.status.slice(1).replace('_', ' ')}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users & Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Recent Users ({orgUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orgUsers.slice(0, 4).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <StatusBadge variant={user.role === 'org_admin' ? 'info' : 'muted'}>
                      {user.role === 'org_admin' ? 'Admin' : 'Agent'}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-muted-foreground" />
                Recent Tickets ({orgTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orgTickets.slice(0, 4).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        ticket.priority === 'urgent' ? 'bg-destructive/10' :
                        ticket.priority === 'high' ? 'bg-warning/10' : 'bg-muted'
                      }`}>
                        <Ticket className={`h-4 w-4 ${
                          ticket.priority === 'urgent' ? 'text-destructive' :
                          ticket.priority === 'high' ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.ticketNumber}</p>
                      </div>
                    </div>
                    <StatusBadge variant={getStatusVariant(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
