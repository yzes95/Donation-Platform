import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SearchBar({
  value,
  onChange,
  placeholder = 'بحث...',
  className,
  onClear,
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-stone-400 dark:text-stone-500">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-surface-darkCard ps-11 pe-10 py-3.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
