import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataCardProps {
  title: string;
  subtitle?: string;
  metadata?: Array<{ label: string; value: string | number }>;
  badges?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  actions?: Array<{ label: string; onClick: () => void; destructive?: boolean }>;
  className?: string;
}

export function DataCard({
  title,
  subtitle,
  metadata,
  badges,
  icon,
  onClick,
  actions,
  className,
}: DataCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold leading-none">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={action.destructive ? 'text-destructive' : ''}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {badges && <div className="flex flex-wrap gap-1.5">{badges}</div>}
        {metadata && metadata.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {metadata.map((item, index) => (
              <div key={index} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
