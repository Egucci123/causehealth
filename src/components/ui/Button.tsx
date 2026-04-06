import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary-container text-on-primary hover:opacity-90 focus:ring-secondary active:scale-[0.98] shadow-md': variant === 'primary',
            'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high focus:ring-secondary shadow-sm': variant === 'secondary',
            'bg-transparent text-primary-container hover:bg-surface-container-high focus:ring-secondary': variant === 'outline',
            'text-secondary hover:bg-surface-container-high/30 focus:ring-secondary': variant === 'ghost',
            'bg-error text-on-error hover:opacity-90 focus:ring-error': variant === 'danger',
          },
          {
            'text-sm px-4 py-1.5 rounded-full gap-1.5': size === 'sm',
            'text-sm px-6 py-2.5 rounded-full gap-2': size === 'md',
            'text-base px-8 py-3.5 rounded-full gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
