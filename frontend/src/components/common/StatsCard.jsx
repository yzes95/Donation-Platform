import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up',
  className,
  iconColor = 'text-primary-700 dark:text-primary-400',
  iconBg = 'bg-primary-50 dark:bg-primary-950/60',
}) {
  return (
    <Card className={cn("p-6 flex flex-col justify-between space-y-4 hover:shadow-card-hover transition-all", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {title}
        </span>
        {Icon && (
          <div className={cn("p-3 rounded-2xl shrink-0", iconBg, iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            {trend && (
              <span className={cn(
                "inline-flex items-center gap-0.5 font-bold",
                trendType === 'up' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}>
                {trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
