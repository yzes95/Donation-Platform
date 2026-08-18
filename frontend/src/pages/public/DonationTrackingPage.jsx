import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackDonation } from '../../api/donations';
import { Timeline } from '../../components/common/Timeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Search, Compass, ShieldCheck, Heart, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function DonationTrackingPage() {
  const { t, i18n } = useTranslation(['donation', 'common']);
  const [searchParams] = useSearchParams();
  const currentLang = i18n.language || 'ar';

  const initialRef = searchParams.get('ref') || '';
  const [refInput, setRefInput] = useState(initialRef);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!refInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await trackDonation(refInput.trim());
      setDonation(data);
    } catch (err) {
      setDonation(null);
      setError(t('tracking.noRefFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      handleSearch();
    }
  }, [initialRef]);

  const handleCopyRef = () => {
    if (donation?.referenceId && navigator.clipboard) {
      navigator.clipboard.writeText(donation.referenceId);
      toast.success(t('confirmation.copied'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('tracking.title')}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t('tracking.subtitle')}
        </p>
      </div>

      {/* Search Input Box */}
      <Card className="p-6 sm:p-8 max-w-2xl mx-auto shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
            {t('tracking.searchLabel')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder={t('tracking.searchPlaceholder')}
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface-darkCard px-4 py-3 text-sm font-mono text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              icon={Search}
              className="px-6 py-3"
            >
              {t('tracking.searchBtn')}
            </Button>
          </div>
          <p className="text-[11px] text-stone-400">
            💡 تجد رقم المرجع في إيصال التبرع، أو في الرسالة النصية / البريد الإلكتروني المرسل لك.
          </p>
        </form>
      </Card>

      {/* Error display */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {donation && (
        <div className="space-y-8 max-w-3xl mx-auto">
          
          {/* Summary Box */}
          <div className="card-base p-6 sm:p-8 space-y-4 shadow-sm border-s-4 border-s-primary-600">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  رقم المرجع الإلكتروني
                </span>
                <span className="font-mono text-lg font-black text-stone-900 dark:text-stone-100">
                  {donation.referenceId}
                </span>
              </div>
              <StatusBadge status={donation.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 block">المبلغ الإجمالي</span>
                <span className="font-bold text-primary-700 dark:text-primary-400 text-sm">
                  {formatCurrency(donation.totalPaid || donation.amount, currentLang)}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">الحالة المستفيدة</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {donation.familyName || 'دعم المنصة السحابية'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">تاريخ العملية</span>
                <span className="font-mono text-stone-600 dark:text-stone-300">
                  {formatDateTime(donation.createdAt, currentLang)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Tracking View */}
          <div className="card-base p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary-600" />
              <span>{t('tracking.timelineTitle')}</span>
            </h3>
            
            <Timeline donation={donation} />
          </div>

        </div>
      )}

    </div>
  );
}
