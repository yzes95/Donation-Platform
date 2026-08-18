import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-darkCard border border-stone-200/80 dark:border-surface-darkBorder rounded-2xl p-6 transition-all duration-200 shadow-sm",
        hover && "hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:border-primary-500/40 dark:hover:border-primary-500/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-stone-500 dark:text-stone-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-stone-100 dark:border-stone-800/80", className)} {...props}>
      {children}
    </div>
  );
}
