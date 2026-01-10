import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/hooks/use-sidebar';
import type { UserRole } from '@/types';
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  KeyRound,
  MessageSquare,
  Contact,
  Briefcase,
  HandshakeIcon,
  Ticket,
  Inbox,
  UsersRound,
  Settings,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItemConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: UserRole[];
}

const navItems: NavItemConfig[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['god_admin', 'org_admin', 'agent'] },
  { label: 'Organizations', icon: Building2, path: '/organizations', roles: ['god_admin'] },
  { label: 'Users', icon: Users, path: '/users', roles: ['god_admin'] },
  { label: 'Roles', icon: Shield, path: '/roles', roles: ['god_admin'] },
  { label: 'Permissions', icon: KeyRound, path: '/permissions', roles: ['god_admin'] },
  { label: 'Contacts', icon: Contact, path: '/contacts', roles: ['org_admin', 'agent'] },
  { label: 'Accounts', icon: Briefcase, path: '/accounts', roles: ['org_admin', 'agent'] },
  { label: 'Deals', icon: HandshakeIcon, path: '/deals', roles: ['org_admin', 'agent'] },
  { label: 'Tickets', icon: Ticket, path: '/tickets', roles: ['org_admin', 'agent'] },
  { label: 'Inbox', icon: Inbox, path: '/inbox', roles: ['org_admin', 'agent'] },
  { label: 'Channels', icon: MessageSquare, path: '/channels', roles: ['god_admin', 'org_admin'] },
  { label: 'Teams', icon: UsersRound, path: '/teams', roles: ['org_admin'] },
  { label: 'Audit Logs', icon: FileText, path: '/audit-logs', roles: ['god_admin'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['org_admin'] },
  { label: 'Profile', icon: User, path: '/profile', roles: ['god_admin', 'org_admin', 'agent'] },
];

export function AppSidebar() {
  const { user, hasPermission } = useAuth();
  const { collapsed, toggleCollapsed, isMobileOpen, setMobileOpen, isMobile } = useSidebar();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles));

  // Close mobile sidebar when route changes
  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
          // Desktop
          !isMobile && (collapsed ? 'w-16' : 'w-60'),
          // Mobile
          isMobile && 'w-60',
          isMobile && (isMobileOpen ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        {/* Logo area */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          {(!collapsed || isMobile) && (
            <span className="text-base font-semibold text-foreground animate-fade-in">
              CRM Console
            </span>
          )}
          {isMobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded p-1.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={toggleCollapsed}
              className="rounded p-1.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-2">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && !isMobile && 'justify-center px-2'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Role indicator (for demo) */}
        {(!collapsed || isMobile) && (
          <div className="border-t border-sidebar-border p-3">
            <div className="rounded-md bg-sidebar-accent px-3 py-2">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-sidebar-accent-foreground">
                {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
