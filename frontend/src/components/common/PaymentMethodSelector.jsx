import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentMethods } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Zap, Smartphone, CreditCard, Globe, Receipt, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Zap,
  Smartphone,
  CreditCard,
  Globe,
  Receipt,
};

export function PaymentMethodSelector({ selected, onSelect, className }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {PaymentMethods.map((method) => {
        const Icon = iconMap[method.icon] || CreditCard;
        const isSelected = selected === method.id;
        const title = isArabic ? method.nameAr : method.nameEn;
        const desc = isArabic ? method.descriptionAr : method.descriptionEn;

        return (
          <div
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex items-start gap-3.5 select-none",
              isSelected
                ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm ring-2 ring-primary-500/20"
                : "border-stone-200 dark:border-stone-800 bg-white dark:bg-surface-darkCard hover:border-stone-300 dark:hover:border-stone-700"
            )}
          >
            {/* Radio icon */}
            <div className="mt-0.5 shrink-0">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                isSelected
                  ? "bg-primary-700 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              )}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {title}
                </h4>
                {(method.badgeAr || method.badgeEn) && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warm-100 dark:bg-warm-950 text-warm-800 dark:text-warm-300 shrink-0">
                    {isArabic ? method.badgeAr : method.badgeEn}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Selection Checkmark */}
            {isSelected && (
              <div className="absolute top-3 end-3 text-primary-600 dark:text-primary-400">
                <CheckCircle2 className="w-4 h-4 fill-primary-600 text-white dark:fill-primary-400 dark:text-stone-900" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
