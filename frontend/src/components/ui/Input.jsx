import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400 dark:text-stone-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface-darkCard px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-150 disabled:opacity-50 disabled:bg-stone-50 dark:disabled:bg-stone-900",
            Icon && "ps-10",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
