import React from 'react';
import { cn } from '../../lib/utils';

export function ProgressBar({
  value = 0,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  size = 'md',
  variant = 'primary',
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-primary-600 dark:bg-primary-500',
    warm: 'bg-warm-500',
    success: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-primary-600 to-warm-500',
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-stone-600 dark:text-stone-300">
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn("w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variants[variant],
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
