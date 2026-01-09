import { useAuth } from '@/contexts/AuthContext';
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
import { Building2, ChevronDown, User, LogOut, Settings } from 'lucide-react';

export function AppHeader() {
  const { user, setUserRole } = useAuth();

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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Left: Org context */}
      <div className="flex items-center gap-2">
        {user.organizationName && (
          <>
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user.organizationName}</span>
          </>
        )}
        {user.role === 'god_admin' && (
          <span className="text-sm text-muted-foreground">Platform Administration</span>
        )}
      </div>

      {/* Right: Role switcher (demo) + User menu */}
      <div className="flex items-center gap-4">
        {/* Role Switcher for Demo */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
            <span className="text-muted-foreground">View as:</span>
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
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-secondary">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
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
