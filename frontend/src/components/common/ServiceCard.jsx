import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import { formatCurrency, calculateProgress } from '../../lib/formatters';
import { useDonation } from '../../store/DonationContext';
import { Heart, Stethoscope, Home, GraduationCap, Utensils, ShieldAlert, HeartHandshake, Flame } from 'lucide-react';

const categoryIcons = {
  medical: Stethoscope,
  housing: Home,
  education: GraduationCap,
  food: Utensils,
  debt_relief: ShieldAlert,
  orphan_care: HeartHandshake,
  emergencies: Flame,
};

export function ServiceCard({ service, family }) {
  const { t, i18n } = useTranslation(['families', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');
  const { setDonationTarget } = useDonation();

  const title = isArabic ? service.titleAr : service.titleEn;
  const description = isArabic ? service.descriptionAr : service.descriptionEn;
  const beneficiary = isArabic ? service.beneficiaryAr : service.beneficiaryEn;
  const progress = calculateProgress(service.raisedAmount, service.targetAmount);

  const CategoryIcon = categoryIcons[service.category] || Heart;

  return (
    <div className="card-hover p-5 flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 shrink-0">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-medium text-stone-400 dark:text-stone-500">
              {service.code}
            </span>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
              {title}
            </h4>
          </div>
        </div>
        <StatusBadge status={service.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
        {description}
      </p>

      {/* Progress & Target */}
      <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500 dark:text-stone-400">
            {t('service.beneficiary')}: <strong className="text-stone-700 dark:text-stone-200">{beneficiary}</strong>
          </span>
          <span className="font-bold text-primary-700 dark:text-primary-400">
            {progress}%
          </span>
        </div>

        <ProgressBar value={service.raisedAmount} max={service.targetAmount} size="sm" variant="primary" />

        <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400">
          <span>{t('service.raisedAmount')}: {formatCurrency(service.raisedAmount, currentLang)}</span>
          <span>{t('service.targetAmount')}: {formatCurrency(service.targetAmount, currentLang)}</span>
        </div>
      </div>

      {/* Donate Button */}
      <div className="pt-2">
        {service.status === 'funded' || service.status === 'completed' ? (
          <div className="text-center py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {t('service.fulfilledMessage')}
          </div>
        ) : (
          <Link
            to="/donate"
            onClick={() => setDonationTarget({ family, service, type: 'family' })}
            className="btn-primary text-xs py-2.5 w-full text-center"
          >
            {t('service.donateForService')}
          </Link>
        )}
      </div>
    </div>
  );
}
