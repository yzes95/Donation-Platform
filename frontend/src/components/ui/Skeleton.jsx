import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800",
        className
      )}
      {...props}
    />
  );
}

export function FamilyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-darkCard border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      <div className="pt-2 flex gap-3">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
