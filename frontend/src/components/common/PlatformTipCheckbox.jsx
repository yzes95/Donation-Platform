import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, ShieldCheck, HeartHandshake } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../lib/formatters';

export function PlatformTipCheckbox({
  enabled,
  onToggle,
  tipAmount,
  onTipChange,
  className
}) {
  const { t, i18n } = useTranslation('donation');
  const currentLang = i18n.language || 'ar';
  const tipOptions = [10, 20, 50, 100];

  return (
    <div className={cn("p-4 rounded-2xl border border-primary-200/70 dark:border-primary-900/50 bg-primary-50/40 dark:bg-primary-950/20 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="platformTipCheck"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer"
        />
        <label htmlFor="platformTipCheck" className="cursor-pointer flex-1">
          <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-stone-100">
            <Cloud className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>{t('checkout.platformTipTitle')}</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            {t('checkout.platformTipDesc')}
          </p>
        </label>
      </div>

      {enabled && (
        <div className="pt-2 border-t border-primary-200/50 dark:border-primary-900/40 flex flex-wrap items-center gap-2 ps-7">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
            {t('checkout.tipAmount')}:
          </span>
          <div className="flex gap-1.5">
            {tipOptions.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onTipChange(amt)}
                className={cn(
                  "px-3 py-1 text-xs rounded-xl font-semibold transition-all",
                  tipAmount === amt
                    ? "bg-primary-700 text-white shadow-sm"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-primary-500"
                )}
              >
                {formatCurrency(amt, currentLang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
