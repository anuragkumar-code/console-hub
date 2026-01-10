import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { SidebarProvider, useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: AppLayoutProps) {
  const { collapsed, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          // Desktop: adjust padding based on sidebar state
          !isMobile && (collapsed ? 'pl-16' : 'pl-60'),
          // Mobile: no padding, full width
          isMobile && 'pl-0'
        )}
      >
        <AppHeader />
        <main className="min-h-[calc(100vh-3.5rem)] animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
