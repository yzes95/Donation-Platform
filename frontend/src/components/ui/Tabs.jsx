import React from 'react';
import { cn } from '../../lib/utils';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("flex space-x-1 rtl:space-x-reverse border-b border-stone-200 dark:border-stone-800 overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-150",
              isActive
                ? "border-primary-600 text-primary-700 dark:text-primary-400 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:border-stone-300"
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                isActive
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300"
                  : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
