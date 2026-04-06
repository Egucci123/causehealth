import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        {
          'rounded h-4': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-xl': variant === 'rectangular',
        },
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-bg-dark-card rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-4">
      <Skeleton className="w-1/3 h-5" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="w-16 h-6" variant="rectangular" />
        <Skeleton className="w-20 h-6" variant="rectangular" />
      </div>
    </div>
  );
}
