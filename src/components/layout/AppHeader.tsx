import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, ChevronDown, User, LogOut, Settings, Menu, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout, isGodAdmin } = useAuth();
  const { setMobileOpen, isMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user initials
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase()
    : 'U';

  // Get display name
  const displayName = user
    ? user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName
    : 'User';

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Left: Mobile menu + Org context */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {user?.organizationName && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium hidden sm:inline">{user.organizationName}</span>
          </div>
        )}
        {isGodAdmin && (
          <span className="text-sm text-muted-foreground hidden sm:inline">Platform Administration</span>
        )}
      </div>

      {/* Right: Theme toggle + User menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Role Badge */}
        {user?.role && (
          <div className="hidden sm:flex items-center gap-1 rounded-md border border-border px-2 md:px-3 py-1.5 text-xs md:text-sm">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium">
              {user.role.name}
            </span>
          </div>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-secondary transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
