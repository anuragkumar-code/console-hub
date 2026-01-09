import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'muted';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  muted: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ variant = 'default', children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get variant from common status strings
export function getStatusVariant(status: string): BadgeVariant {
  const statusLower = status.toLowerCase();
  
  if (['active', 'resolved', 'closed_won', 'verified'].includes(statusLower)) {
    return 'success';
  }
  if (['pending', 'not_verified', 'qualified', 'proposal'].includes(statusLower)) {
    return 'warning';
  }
  if (['inactive', 'suspended', 'closed_lost', 'closed'].includes(statusLower)) {
    return 'muted';
  }
  if (['urgent', 'high', 'breached'].includes(statusLower)) {
    return 'destructive';
  }
  if (['open', 'lead', 'negotiation'].includes(statusLower)) {
    return 'info';
  }
  
  return 'default';
}

export function getPriorityVariant(priority: string): BadgeVariant {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'muted';
    default:
      return 'default';
  }
}
