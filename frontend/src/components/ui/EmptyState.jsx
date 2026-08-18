import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'لا توجد بيانات متاحة',
  description = 'لم نتمكن من العثور على أي عناصر مطابقة في الوقت الحالي.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-surface-darkCard border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl">
      <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-stone-400 dark:text-stone-500 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
