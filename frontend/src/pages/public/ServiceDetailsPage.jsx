import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getService } from '../../api/families';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency, calculateProgress } from '../../lib/formatters';
import { useDonation } from '../../store/DonationContext';
import { Heart, Share2, ShieldCheck, MapPin, Users, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ServiceDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['families', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');
  const { setDonationTarget } = useDonation();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getService(id);
        setService(data);
      } catch (err) {
        setError(err.message || 'Service not found');
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

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const title = isArabic ? service.titleAr : service.titleEn;
  const description = isArabic ? service.descriptionAr : service.descriptionEn;
  const beneficiary = isArabic ? service.beneficiaryAr : service.beneficiaryEn;
  const familyName = service.family ? (isArabic ? service.family.nameAr : service.family.nameEn) : '';
  const progress = calculateProgress(service.raisedAmount, service.targetAmount);
  const remaining = Math.max(service.targetAmount - service.raisedAmount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb Back Link */}
      {service.family && (
        <Link
          to={`/families/${service.family.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-primary-600 transition-colors"
        >
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isArabic ? `العودة لملف ${familyName}` : `Return to ${familyName}`}</span>
        </Link>
      )}

      {/* Main Card */}
      <div className="card-base p-6 sm:p-10 space-y-8 shadow-md">
        
        {/* Top Badges & Share */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-mono font-bold text-sm">
              {service.code}
            </span>
            <StatusBadge status={service.status} />
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

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
            {title}
          </h1>
          {service.family && (
            <p className="text-xs text-stone-500">
              {isArabic ? 'تابع لـ:' : 'Case affiliated with:'}{' '}
              <Link to={`/families/${service.family.id}`} className="font-bold text-primary-700 dark:text-primary-400 hover:underline">{familyName}</Link>
            </p>
          )}
        </div>

        {/* Progress Box */}
        <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-400 block">{t('service.raisedAmount')}</span>
              <span className="text-2xl sm:text-3xl font-black text-primary-700 dark:text-primary-400">
                {formatCurrency(service.raisedAmount, currentLang)}
              </span>
            </div>
            <div className="text-end">
              <span className="text-xs text-stone-400 block">{t('service.remainingAmount')}</span>
              <span className="text-lg sm:text-xl font-bold text-warm-600 dark:text-warm-400">
                {formatCurrency(remaining, currentLang)}
              </span>
            </div>
          </div>

          <ProgressBar value={service.raisedAmount} max={service.targetAmount} size="lg" variant="primary" showLabel />

          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>{isArabic ? 'الهدف المطلوب:' : 'Target Goal:'} {formatCurrency(service.targetAmount, currentLang)}</span>
            <span>{isArabic ? `عدد المساهمين: ${service.donorsCount} متبرع` : `Donors: ${service.donorsCount}`}</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {t('service.explanation')}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Beneficiary Badge */}
        <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 flex items-center justify-between text-xs">
          <span className="text-stone-600 dark:text-stone-300">
            {t('service.beneficiary')}: <strong className="text-primary-800 dark:text-primary-300 font-bold">{beneficiary}</strong>
          </span>
          <span className="text-stone-400">{isArabic ? 'تحقق ميداني معتمد' : 'Verified by field team'}</span>
        </div>

        {/* Donate CTA */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          {service.status === 'funded' || service.status === 'completed' ? (
            <div className="text-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 inline me-2" />
              {t('service.fulfilledMessage')}
            </div>
          ) : (
            <Link
              to="/donate"
              onClick={() => setDonationTarget({ family: service.family, service, type: 'family' })}
              className="btn-primary w-full py-4 text-base font-bold shadow-lg text-center block rounded-2xl"
            >
              <Heart className="w-5 h-5 fill-white inline me-2" />
              <span>{t('service.donateForService')}</span>
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
