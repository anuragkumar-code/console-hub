import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Building2, 
  Users, 
  Contact, 
  Briefcase, 
  Ticket, 
  HandshakeIcon,
  MessageSquare,
  AlertTriangle 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Dashboard() {
  const { user, isGodAdmin, setUserRole } = useAuth();

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  // God Admin Dashboard
  if (isGodAdmin) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">Platform Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back. Here's what's happening across the platform.
            </p>
          </div>
          
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Organizations"
            value="8"
            change={{ value: '2 this month', positive: true }}
            icon={<Building2 className="h-5 w-5" />}
          />
          <StatCard
            title="Total Users"
            value="234"
            change={{ value: '12% vs last month', positive: true }}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Active Channels"
            value="18"
            icon={<MessageSquare className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Issues"
            value="3"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New organization created', detail: 'Stark Industries', time: '2 hours ago' },
              { action: 'User role updated', detail: 'jane@acme.com → Admin', time: '4 hours ago' },
              { action: 'Channel verified', detail: 'WhatsApp - Support', time: '1 day ago' },
              { action: 'Organization suspended', detail: 'Cyberdyne Systems', time: '2 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Org Admin / Agent Dashboard
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {getUserDisplayName()}. Here's an overview of your workspace.
          </p>
        </div>
        
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value="156"
          change={{ value: '8 this week', positive: true }}
          icon={<Contact className="h-5 w-5" />}
        />
        <StatCard
          title="Active Accounts"
          value="24"
          icon={<Briefcase className="h-5 w-5" />}
        />
        <StatCard
          title="Open Tickets"
          value="12"
          change={{ value: '3 urgent', positive: false }}
          icon={<Ticket className="h-5 w-5" />}
        />
        <StatCard
          title="Pipeline Value"
          value="$685K"
          change={{ value: '15% vs last month', positive: true }}
          icon={<HandshakeIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tickets */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            {[
              { id: 'TKT-001238', subject: 'API rate limit exceeded', priority: 'Urgent', status: 'Open' },
              { id: 'TKT-001234', subject: 'Unable to access dashboard', priority: 'High', status: 'Open' },
              { id: 'TKT-001235', subject: 'Integration not syncing', priority: 'Medium', status: 'Pending' },
            ].map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.id}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  ticket.priority === 'Urgent' 
                    ? 'bg-destructive/10 text-destructive' 
                    : ticket.priority === 'High'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-info/10 text-info'
                }`}>
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold mb-4">Pipeline Overview</h2>
          <div className="space-y-3">
            {[
              { title: 'Enterprise License - TechStart', value: '$150,000', stage: 'Negotiation' },
              { title: 'Annual Subscription - DataFlow', value: '$45,000', stage: 'Proposal' },
              { title: 'Pilot Program - CloudNine', value: '$15,000', stage: 'Qualified' },
            ].map((deal, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">{deal.value}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">
                  {deal.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
