import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDonation } from '../../api/donations';
import { formatCurrency, formatDateTime, maskDonorName, downloadReceipt } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Compass,
  ArrowRight,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function DonationConfirmationPage() {
  const { referenceId } = useParams();
  const { t, i18n } = useTranslation(['donation', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const don = await getDonation(referenceId);
        setDonation(don);

        // Fire festive celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0F766E', '#14B8A6', '#F59E0B', '#10B981']
          });
        } catch {
          // ignore
        }
      } catch (err) {
        setError(err.message || 'Donation record not found');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [referenceId]);

  const handleCopyRef = () => {
    if (donation?.referenceId && navigator.clipboard) {
      navigator.clipboard.writeText(donation.referenceId);
      toast.success(t('confirmation.copied'));
    }
  };

  const handleDownload = () => {
    if (donation) {
      downloadReceipt(donation);
      toast.success(t('confirmation.downloadReceipt') + ' - تم البدء في التحميل');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const isPlatform = donation.type === 'platform';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Hero Success Box */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('confirmation.title')}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
          {t('confirmation.subtitle')}
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="card-base p-6 sm:p-10 space-y-6 shadow-xl border-t-8 border-t-emerald-600">
        
        {/* Reference ID banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              {t('confirmation.referenceId')}
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-primary-700 dark:text-primary-400">
              {donation.referenceId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyRef}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t('confirmation.copyRef')}</span>
          </button>
        </div>

        {/* Details Table */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          
          <div className="py-3 flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{t('confirmation.amount')}</span>
            <span className="text-lg font-black text-primary-700 dark:text-primary-400">
              {formatCurrency(donation.totalPaid || donation.amount, currentLang)}
            </span>
          </div>

          {!isPlatform && (
            <>
              <div className="py-3 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">{t('confirmation.family')}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {donation.familyName || 'حالة أسرة معتمدة'}
                </span>
              </div>

              {donation.serviceTitle && (
                <div className="py-3 flex justify-between items-center">
                  <span className="text-stone-500 dark:text-stone-400">{t('confirmation.service')}</span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {donation.serviceTitle}
                  </span>
                </div>
              )}
            </>
          )}

          {isPlatform && (
            <div className="py-3 flex justify-between items-center">
              <span className="text-stone-500 dark:text-stone-400">نوع المساهمة</span>
              <span className="font-bold text-warm-600 dark:text-warm-400">
                دعم استمرارية تشغيل منصة عطاء السحابية
              </span>
            </div>
          )}

          <div className="py-3 flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{t('confirmation.donorIdentity')}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {maskDonorName(donation.donorName, donation.isAnonymous, currentLang)}
            </span>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{t('confirmation.paymentMethod')}</span>
            <span className="font-semibold uppercase text-stone-700 dark:text-stone-300">
              {donation.paymentMethod}
            </span>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{t('confirmation.date')}</span>
            <span className="font-mono text-stone-600 dark:text-stone-400">
              {formatDateTime(donation.createdAt, currentLang)}
            </span>
          </div>

          <div className="py-3 flex justify-between items-center">
            <span className="text-stone-500 dark:text-stone-400">{t('confirmation.status')}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              {t('common:status.successful')}
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="md"
            icon={Download}
            className="w-full text-xs font-bold"
          >
            {t('confirmation.downloadReceipt')}
          </Button>

          <Link
            to={`/track?ref=${donation.referenceId}`}
            className="btn-primary text-xs py-3 w-full text-center flex items-center justify-center gap-2 font-bold"
          >
            <Compass className="w-4 h-4" />
            <span>{t('confirmation.trackDonationBtn')}</span>
          </Link>
        </div>

      </div>

      {/* Return Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-500 pt-4">
        <Link to="/" className="hover:text-primary-700 transition-colors">
          {t('confirmation.backHome')}
        </Link>
        <span>•</span>
        <Link to="/families" className="hover:text-primary-700 transition-colors">
          {t('confirmation.browseMore')}
        </Link>
      </div>

    </div>
  );
}
