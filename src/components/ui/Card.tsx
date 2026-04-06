import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'forest' | 'alert';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover, padding = 'md', variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-3xl shadow-md',
          {
            'bg-surface-container-lowest dark:bg-bg-dark-card': variant === 'default',
            'bg-primary-container text-on-primary': variant === 'forest',
            'bg-surface-container-lowest relative overflow-hidden': variant === 'alert',
          },
          hover && 'transition-shadow duration-200 hover:shadow-lg cursor-pointer',
          {
            '': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {variant === 'alert' && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
