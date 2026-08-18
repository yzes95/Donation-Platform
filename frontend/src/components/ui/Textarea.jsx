import React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface-darkCard px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-150 resize-y disabled:opacity-50",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
