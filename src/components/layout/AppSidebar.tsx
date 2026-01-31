import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/hooks/use-sidebar';
import { navItems, type NavItemConfig } from '@/config/permissions';
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export function AppSidebar() {
  const { user, hasPermission, isGodAdmin } = useAuth();
  const { collapsed, toggleCollapsed, isMobileOpen, setMobileOpen, isMobile } = useSidebar();
  const location = useLocation();

  /**
   * Filter navigation items based on user permissions
   */
  const filteredNavItems = navItems.filter((item: NavItemConfig) => {
    // Always show items marked as alwaysVisible
    if (item.alwaysVisible) return true;
    
    // God admin can see everything
    if (isGodAdmin) return true;
    
    // God admin only items are hidden for non-god admins
    if (item.godAdminOnly) return false;
    
    // Check permission if specified
    if (item.permission) {
      return hasPermission(item.permission.resource, item.permission.action);
    }
    
    // Items without permission requirement are visible
    return true;
  });

  // Close mobile sidebar when route changes
  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Get display name for the user
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  // Get role display name
  const getRoleDisplayName = () => {
    return user?.role?.name || 'Unknown Role';
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

        {/* User info */}
        {(!collapsed || isMobile) && (
          <div className="border-t border-sidebar-border p-3">
            <div className="rounded-md bg-sidebar-accent px-3 py-2">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getRoleDisplayName()}
                {isGodAdmin && (
                  <span className="ml-1 text-primary">(Super Admin)</span>
                )}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
