import React from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export function Avatar({
  src,
  alt = 'User Avatar',
  name,
  size = 'md',
  className
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (n) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-200 border border-primary-200/50 dark:border-primary-800/40 font-semibold select-none shadow-sm",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        <User className="w-1/2 h-1/2 opacity-70" />
      )}
    </div>
  );
}
