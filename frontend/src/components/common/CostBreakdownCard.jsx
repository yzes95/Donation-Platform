import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency, calculateProgress } from '../../lib/formatters';
import { Cloud, Database, CreditCard, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';

const icons = {
  Cloud,
  Database,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Cpu,
};

export function CostBreakdownCard({ item }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');
  const currentLang = i18n.language || 'ar';

  const Icon = icons[item.icon] || Cloud;
  const title = isArabic ? item.nameAr : item.nameEn;
  const desc = isArabic ? item.descriptionAr : item.descriptionEn;
  const progress = calculateProgress(item.currentRaised, item.monthlyTarget);

  return (
    <div className="card-hover p-5 flex flex-col justify-between space-y-4">
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
            {title}
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500 dark:text-stone-400">
            {isArabic ? 'تم جمع: ' : 'Raised: '}<strong className="text-primary-700 dark:text-primary-400">{formatCurrency(item.currentRaised, currentLang)}</strong>
          </span>
          <span className="font-bold text-stone-700 dark:text-stone-200">{progress}%</span>
        </div>
        <ProgressBar value={item.currentRaised} max={item.monthlyTarget} size="sm" variant="primary" />
        <div className="flex justify-between items-center text-[11px] text-stone-400 dark:text-stone-500">
          <span>{isArabic ? 'الهدف الشهري:' : 'Monthly Target:'}</span>
          <span>{formatCurrency(item.monthlyTarget, currentLang)}</span>
        </div>
      </div>
    </div>
  );
}
