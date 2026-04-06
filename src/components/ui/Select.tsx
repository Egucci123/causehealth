import { type SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-[10px] font-bold uppercase tracking-wider text-[#414844]/60 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl text-sm transition-colors duration-200 appearance-none',
            'bg-[#EFEEEB] text-[#1B1C1A] border border-[#C1C8C2]/30',
            'focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]/30',
            error && 'ring-2 ring-[#BA1A1A]/30',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-[#BA1A1A]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
