import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlatformData, createPlatformDonation } from '../../api/platform';
import { CostBreakdownCard } from '../../components/common/CostBreakdownCard';
import { PaymentMethodSelector } from '../../components/common/PaymentMethodSelector';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { PlatformPresetAmounts } from '../../lib/constants';
import { formatCurrency, calculateProgress } from '../../lib/formatters';
import { Cloud, Heart, ShieldCheck, CheckCircle2, Server, Database, Lock, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SupportPlatformPage() {
  const { t, i18n } = useTranslation(['platform', 'common']);
  const navigate = useNavigate();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPlatformData();
        setPlatformData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeAmount = customAmount ? Number(customAmount) : amount;

  const handleSelectPreset = (amt) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAmount || activeAmount < 10) {
      toast.error(isArabic ? 'الحد الأدنى للتبرع هو 10 ج.م' : 'Minimum donation is 10 EGP');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: activeAmount,
        donorName: isAnonymous ? null : donorName,
        donorEmail,
        isAnonymous,
        paymentMethod,
      };

      const result = await createPlatformDonation(payload);
      toast.success(isArabic ? 'شكراً لمساهمتك الكريمة في دعم تشغيل منصة عطاء' : 'Thank you for supporting Ataa Platform operations!');
      navigate(`/donation/confirmation/${result.referenceId}`);
    } catch (err) {
      toast.error(err.message || 'Error processing donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const progress = calculateProgress(platformData.currentRaised, platformData.monthlyTarget);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-warm-100 dark:bg-warm-950 text-warm-800 dark:text-warm-300 text-xs font-bold border border-warm-200 dark:border-warm-800/80">
          <Cloud className="w-4 h-4 text-warm-600 shrink-0" />
          <span>{isArabic ? 'صندوق دعم البنية التحتية والتشغيل السحابي' : 'Cloud Infrastructure & Platform Fund'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('support.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
          {t('support.subtitle')}
        </p>
      </div>

      {/* 2. MONTHLY TARGET PROGRESS CARD */}
      <div className="card-base p-6 sm:p-8 space-y-6 shadow-md border-s-4 border-s-warm-500">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('support.monthlyGoalTitle')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('support.monthlyGoalDesc')}
            </p>
          </div>
          <div className="text-end">
            <span className="text-2xl font-black text-primary-700 dark:text-primary-400">
              {formatCurrency(platformData.currentRaised, currentLang)}
            </span>
            <span className="text-xs text-stone-400 block">
              {isArabic ? 'من هدف' : 'of goal'} {formatCurrency(platformData.monthlyTarget, currentLang)} ({progress}%)
            </span>
          </div>
        </div>

        <ProgressBar value={platformData.currentRaised} max={platformData.monthlyTarget} size="lg" variant="warm" showLabel />
      </div>

      {/* 3. DEDICATED PLATFORM DONATION FORM */}
      <form onSubmit={handleSubmit} className="card-base p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-warm-600" />
            <span>{t('support.donateToPlatform')}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {t('support.donorPledgeNotice')}
          </p>
        </div>

        {/* Amount Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
            {isArabic ? 'اختر مبلغ المساهمة (ج.م)' : 'Select Contribution Amount (EGP)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PlatformPresetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleSelectPreset(amt)}
                className={`py-3.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                  !customAmount && amount === amt
                    ? 'bg-warm-600 text-white border-warm-600 shadow-md ring-2 ring-warm-500/20'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-warm-500'
                }`}
              >
                {formatCurrency(amt, currentLang)}
              </button>
            ))}
          </div>
          <Input
            type="text"
            label={isArabic ? 'أو أدخل مبلغاً آخر لدعم المنصة' : 'Or enter custom amount'}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={isArabic ? 'مثال: 300' : 'e.g. 300'}
          />
        </div>

        {/* Donor identity */}
        <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                isAnonymous
                  ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              {isArabic ? 'مساهمة كفاعل خير (مجهول)' : 'Anonymous Contribution'}
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                !isAnonymous
                  ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              {isArabic ? 'مساهمة باسمي أو اسم الشركة' : 'Public / Corporate Name'}
            </button>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isArabic ? 'الاسم أو اسم المؤسسة' : 'Your Name / Company'}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={isArabic ? 'اسم المتبرع' : 'Donor name'}
                icon={User}
              />
              <Input
                type="email"
                label={isArabic ? 'البريد الإلكتروني للإيصال' : 'Email Address for Receipt'}
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
            {isArabic ? 'اختر وسيلة السداد' : 'Select Payment Method'}
          </label>
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            {isArabic ? 'الإجمالي المستحق للدفع: ' : 'Total Amount: '}<strong className="text-xl font-black text-warm-600 dark:text-warm-400 ms-2">{formatCurrency(activeAmount, currentLang)}</strong>
          </div>
          <Button
            type="submit"
            variant="warm"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto px-10 py-3.5 font-bold rounded-2xl shadow-lg"
          >
            {isArabic ? 'تأكيد التبرع لدعم المنصة' : 'Confirm Platform Donation'}
          </Button>
        </div>
      </form>

      {/* 4. COST BREAKDOWN GRID */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {t('support.costBreakdownTitle')}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {t('support.costBreakdownSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformData.costs.map((item) => (
            <CostBreakdownCard key={item.id} item={item} />
          ))}
        </div>
      </div>

    </div>
  );
}
