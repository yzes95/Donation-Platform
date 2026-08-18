import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  icon: Icon,
  ...props
}) {
  const variants = {
    default: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    primary: "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border-primary-200/60 dark:border-primary-800/50",
    warm: "bg-warm-50 text-warm-700 dark:bg-warm-950/60 dark:text-warm-300 border-warm-200/60 dark:border-warm-800/50",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
    danger: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/60 dark:border-red-800/50",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
