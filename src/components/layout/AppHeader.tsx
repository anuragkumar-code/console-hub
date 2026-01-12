import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/hooks/use-sidebar';
import { UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, ChevronDown, User, LogOut, Settings, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AppHeader() {
  const { user, setUserRole } = useAuth();
  const { setMobileOpen, isMobile } = useSidebar();

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'God Admin', value: 'god_admin' },
    { label: 'Org Admin', value: 'org_admin' },
    { label: 'Agent', value: 'agent' },
  ];

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
        {user.organizationName && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium hidden sm:inline">{user.organizationName}</span>
          </div>
        )}
        {user.role === 'god_admin' && (
          <span className="text-sm text-muted-foreground hidden sm:inline">Platform Administration</span>
        )}
      </div>

      {/* Right: Theme toggle + Role switcher (demo) + User menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Role Switcher for Demo */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded-md border border-border px-2 md:px-3 py-1.5 text-xs md:text-sm hover:bg-secondary transition-colors">
            <span className="text-muted-foreground hidden sm:inline">View as:</span>
            <span className="font-medium">
              {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roleOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setUserRole(option.value)}
                className={user.role === option.value ? 'bg-secondary' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-secondary transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
