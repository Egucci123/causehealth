import { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200',
            'bg-[#EFEEEB] text-on-surface border border-[#C1C8C2]/30',
            'placeholder:text-[#414844]/40',
            'focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]/30',
            error
              ? 'ring-2 ring-error/30'
              : '',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
        {hint && !error && <p className="mt-1 text-[11px] text-on-surface-variant/50">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
