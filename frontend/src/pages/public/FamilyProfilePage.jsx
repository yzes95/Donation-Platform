import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFamily } from '../../api/families';
import { getDonationHistory } from '../../api/donations';
import { ServiceCard } from '../../components/common/ServiceCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, formatDate, calculateProgress, maskDonorName } from '../../lib/formatters';
import { useDonation } from '../../store/DonationContext';
import {
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  Lock,
  Heart,
  Home,
  Briefcase,
  Share2,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export function FamilyProfilePage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['families', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');
  const { setDonationTarget } = useDonation();

  const [family, setFamily] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const familyData = await getFamily(id);
        setFamily(familyData);
        const donList = await getDonationHistory(familyData.id);
        setDonations(donList);
      } catch (err) {
        setError(err.message || 'Failed to load family profile');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('common:actions.copyLink') + ' ' + t('common:actions.confirm'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !family) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const name = isArabic ? family.nameAr : family.nameEn;
  const governorate = isArabic ? family.governorateAr : family.governorateEn;
  const summary = isArabic ? family.summaryAr : family.summaryEn;
  const socialStatus = isArabic ? family.socialStatusAr : family.socialStatusEn;
  const housingStatus = isArabic ? family.housingStatusAr : family.housingStatusEn;
  const progress = calculateProgress(family.totalRaised, family.totalTarget);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. TOP HEADER BANNER & OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Info & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6 sm:p-8 space-y-6">
            
            {/* Top Row: Case Code & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-mono font-bold text-sm">
                  {family.code}
                </span>
                <StatusBadge status={family.status} />
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('common:actions.share')}</span>
              </button>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-warm-500" />
                  {governorate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary-600" />
                  {t('card.membersCount', { count: family.membersCount })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  {t('profile.verificationDate')}: {formatDate(family.verifiedAt, currentLang)}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {t('profile.familySummary')}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Family Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 block">{t('profile.socialStatus')}</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">{socialStatus}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 block">{t('profile.housingStatus')}</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">{housingStatus}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 block">{t('profile.monthlyIncome')}</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">{formatCurrency(family.monthlyIncome, currentLang)}</span>
              </div>
            </div>

            {/* Privacy Guarantee Alert */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-start gap-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              <Lock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>{t('profile.privacyNotice')}</span>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Overall Funding Card */}
        <div className="space-y-6">
          <div className="card-base p-6 sm:p-8 space-y-6 sticky top-28">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                {isArabic ? 'موقف التمويل الإجمالي للأسرة' : 'Overall Case Funding Progress'}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-primary-700 dark:text-primary-400">
                  {formatCurrency(family.totalRaised, currentLang)}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {isArabic ? 'من' : 'of'} {formatCurrency(family.totalTarget, currentLang)}
                </span>
              </div>
            </div>

            <ProgressBar value={family.totalRaised} max={family.totalTarget} size="lg" variant="primary" showLabel />

            <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-800 dark:text-primary-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('profile.verifiedBy')}</span>
              </div>
              <p className="text-[11px] text-primary-900/70 dark:text-primary-300/70 font-semibold">
                {isArabic ? (family.verifiedByAr || family.verifiedBy) : (family.verifiedByEn || family.verifiedBy)}
              </p>
            </div>

            <Link
              to="/donate"
              onClick={() => setDonationTarget({ family, type: 'family' })}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-md text-center block"
            >
              <Heart className="w-4 h-4 fill-white inline me-2" />
              <span>{t('profile.donateToFamilyCTA')}</span>
            </Link>
          </div>
        </div>

      </div>

      {/* 2. SERVICES & ASSISTANCE NEEDS LIST */}
      <div className="space-y-6 pt-6 border-t border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            {t('profile.assistanceNeedsTitle')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {t('profile.assistanceNeedsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {family.services && family.services.length > 0 ? (
            family.services.map((service) => (
              <ServiceCard key={service.id} service={service} family={family} />
            ))
          ) : (
            <p className="text-sm text-stone-500">
              {isArabic ? 'لا توجد خدمات إضافية مسجلة حالياً.' : 'No additional services listed at this moment.'}
            </p>
          )}
        </div>
      </div>

      {/* 3. RECENT DONATIONS LIST (Transparency) */}
      <div className="card-base p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
          {t('profile.recentDonors')} ({donations.length})
        </h3>
        
        {donations.length > 0 ? (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {donations.map((don) => (
              <div key={don.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300">
                    <Heart className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {maskDonorName(isArabic ? (don.donorNameAr || don.donorName) : (don.donorNameEn || don.donorName), don.isAnonymous, currentLang)}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {formatDate(don.createdAt, currentLang)} • {isArabic ? (don.serviceTitleAr || don.serviceTitle || 'تبرع عام') : (don.serviceTitleEn || don.serviceTitle || 'General Case Donation')}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-primary-700 dark:text-primary-400 text-sm">
                  {formatCurrency(don.amount, currentLang)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400">
            {isArabic ? 'كن أول من يساهم في فك كرب هذه الحالة الكريمة.' : 'Be the first to contribute towards this verified case.'}
          </p>
        )}
      </div>

    </div>
  );
}
