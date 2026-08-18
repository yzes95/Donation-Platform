import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export function Spinner({ className, size = 'md', ...props }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary-600 dark:text-primary-400", sizes[size], className)}
      {...props}
    />
  );
}
