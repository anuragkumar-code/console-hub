import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  className?: string;
  message?: string;
}

export function PageLoader({ className, message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 4, className }: CardSkeletonProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-5 animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-md skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-2/3 rounded skeleton-shimmer" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-16 rounded-full skeleton-shimmer" />
            <div className="h-5 w-12 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('rounded-md border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-table-header px-4 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 flex-1 rounded skeleton-shimmer" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="px-4 py-3 flex gap-4 border-t border-border animate-fade-in"
          style={{ animationDelay: `${rowIdx * 50}ms` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="h-4 flex-1 rounded skeleton-shimmer" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface StatSkeletonProps {
  count?: number;
  className?: string;
}

export function StatSkeleton({ count = 4, className }: StatSkeletonProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-5 animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded skeleton-shimmer" />
            <div className="h-8 w-8 rounded skeleton-shimmer" />
          </div>
          <div className="mt-3 h-8 w-24 rounded skeleton-shimmer" />
          <div className="mt-2 h-3 w-32 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}
