import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import { MapPin, Users, HeartHandshake, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { formatCurrency, calculateProgress } from '../../lib/formatters';
import { useDonation } from '../../store/DonationContext';

export function FamilyCard({ family }) {
  const { t, i18n } = useTranslation(['families', 'common']);
  const currentLang = i18n.language || 'ar';
  const { setDonationTarget } = useDonation();

  const progress = calculateProgress(family.totalRaised, family.totalTarget);
  const isArabic = currentLang.startsWith('ar');

  const familyName = isArabic ? family.nameAr : family.nameEn;
  const governorate = isArabic ? family.governorateAr : family.governorateEn;
  const summary = isArabic ? family.summaryAr : family.summaryEn;

  return (
    <div className="group card-hover flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Image with Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={family.image}
          alt={familyName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-center">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-semibold">
            {family.code}
          </span>
          <StatusBadge status={family.status} />
        </div>

        {/* Bottom overlay text */}
        <div className="absolute bottom-3 inset-x-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-stone-200 mb-1">
            <MapPin className="w-3.5 h-3.5 text-warm-400 shrink-0" />
            <span>{governorate}</span>
            <span className="mx-1 opacity-40">•</span>
            <Users className="w-3.5 h-3.5 text-primary-300 shrink-0" />
            <span>{t('card.membersCount', { count: family.membersCount })}</span>
          </div>
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary-300 transition-colors">
            {familyName}
          </h3>
          {(family.familyGroupNameAr || family.institutionNameAr) && (
            <div className="text-[11px] font-semibold text-teal-300 truncate mt-0.5">
              {isArabic 
                ? (family.familyGroupNameAr || family.institutionNameAr)
                : (family.familyGroupNameEn || family.institutionNameEn)}
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
          {summary}
        </p>

        {/* Financial Progress */}
        <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-500 dark:text-stone-400">{t('common:general.raised')}</span>
            <span className="font-bold text-primary-700 dark:text-primary-400">
              {formatCurrency(family.totalRaised, currentLang)}
            </span>
          </div>

          <ProgressBar value={family.totalRaised} max={family.totalTarget} size="md" variant="primary" />

          <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 pt-0.5">
            <span>{t('card.progress')}: {progress}%</span>
            <span>{t('common:general.target')}: {formatCurrency(family.totalTarget, currentLang)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            to={`/families/${family.id}`}
            className="btn-secondary text-xs py-2 w-full text-center"
          >
            {t('card.viewProfile')}
          </Link>
          <Link
            to="/donate"
            onClick={() => setDonationTarget({ family, type: 'family' })}
            className="btn-primary text-xs py-2 w-full text-center"
          >
            {t('card.quickDonate')}
          </Link>
        </div>
      </div>
    </div>
  );
}
