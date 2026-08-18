import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDonation } from '../../api/donations';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDateTime, maskDonorName, downloadReceipt } from '../../lib/formatters';
import { ArrowRight, ArrowLeft, Download, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function DonationDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['donation', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDonation(id);
        setDonation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p className="text-sm text-stone-500">لم يتم العثور على تفاصيل التبرع.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        title="تفاصيل التبرع المستلم"
        subtitle={`بيانات المعاملة رقم ${donation.referenceId}`}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          to="/dashboard/donations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>العودة لسجل التبرعات</span>
        </Link>

        <Card className="p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs text-stone-400 block">رقم المرجع</span>
              <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">{donation.referenceId}</span>
            </div>
            <StatusBadge status={donation.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block">المبلغ</span>
              <span className="text-lg font-black text-primary-700 dark:text-primary-400 font-mono">
                {formatCurrency(donation.amount, currentLang)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">المتبرع</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {maskDonorName(donation.donorName, donation.isAnonymous, currentLang)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">طريقة السداد</span>
              <span className="font-semibold uppercase text-stone-700 dark:text-stone-300">
                {donation.paymentMethod}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-4">
              المسار الزمني لتنفيذ التبرع
            </h4>
            <Timeline donation={donation} />
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => {
                downloadReceipt(donation);
                toast.success('تم تحميل الإيصال');
              }}
            >
              تحميل الإيصال
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
