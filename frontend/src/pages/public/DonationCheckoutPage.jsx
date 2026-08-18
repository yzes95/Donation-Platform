import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDonation } from '../../store/DonationContext';
import { createDonation } from '../../api/donations';
import { getFamilyServices } from '../../api/families';
import { PaymentMethodSelector } from '../../components/common/PaymentMethodSelector';
import { PlatformTipCheckbox } from '../../components/common/PlatformTipCheckbox';
import { FuturisticLock, FuturisticHeart, FuturisticShield } from '../../components/common/InteractiveIcon';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FamilyPresetAmounts } from '../../lib/constants';
import { formatCurrency } from '../../lib/formatters';
import { validateDonationAmount, validateEmail, validatePhone } from '../../lib/validators';
import { Heart, ShieldCheck, User, Mail, Phone, Lock, Sparkles, CheckCircle2, ListFilter } from 'lucide-react';
import { toast } from 'sonner';

export function DonationCheckoutPage() {
  const { t, i18n } = useTranslation(['donation', 'common']);
  const navigate = useNavigate();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const { donationState, updateDonationDetails } = useDonation();

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(donationState.service?.id || 'general');

  const [amount, setAmount] = useState(donationState.amount || 250);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(donationState.isAnonymous);
  const [donorName, setDonorName] = useState(donationState.donorName || '');
  const [donorEmail, setDonorEmail] = useState(donationState.donorEmail || '');
  const [donorPhone, setDonorPhone] = useState(donationState.donorPhone || '');
  const [includePlatformTip, setIncludePlatformTip] = useState(donationState.includePlatformTip);
  const [platformTip, setPlatformTip] = useState(donationState.platformTip || 20);
  const [paymentMethod, setPaymentMethod] = useState(donationState.paymentMethod || 'instapay');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadFamilyNeeds() {
      if (donationState.family?.id) {
        try {
          const srvs = await getFamilyServices(donationState.family.id);
          setAvailableServices(srvs);
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadFamilyNeeds();
  }, [donationState.family]);

  const currentSelectedService = availableServices.find(s => s.id === selectedServiceId) || donationState.service;

  const selectedCaseName = donationState.family
    ? (isArabic ? donationState.family.nameAr : donationState.family.nameEn)
    : 'صندوق دعم الأسر المتعففة والحالات الإنسانية العام';

  const selectedServiceName = currentSelectedService
    ? (isArabic ? currentSelectedService.titleAr : currentSelectedService.titleEn)
    : t('checkout.generalFamilyDonation');

  const activePresets = currentSelectedService?.presetAmounts || FamilyPresetAmounts;

  const activeAmount = customAmount ? Number(customAmount) : amount;
  const tipVal = includePlatformTip ? Number(platformTip) : 0;
  const totalDue = activeAmount + tipVal;

  const handleSelectPreset = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) setAmount(Number(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const amountCheck = validateDonationAmount(activeAmount);
    if (!amountCheck.valid) {
      newErrors.amount = isArabic ? amountCheck.messageAr : amountCheck.messageEn;
    }

    if (!isAnonymous && !donorName.trim()) {
      newErrors.donorName = isArabic ? 'يرجى كتابة الاسم أو اختيار فاعل خير' : 'Please provide name or select anonymous';
    }

    if (donorEmail && !validateEmail(donorEmail)) {
      newErrors.donorEmail = isArabic ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format';
    }

    if (donorPhone && !validatePhone(donorPhone)) {
      newErrors.donorPhone = isArabic ? 'رقم الهاتف غير صالح' : 'Invalid phone number';
    }

    if (!termsAccepted) {
      newErrors.terms = isArabic ? 'يجب الموافقة على الشروط للمتابعة' : 'Must accept terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('يرجى مراجعة وتصحيح الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: donationState.type || 'family',
        familyId: donationState.family?.id || null,
        familyName: selectedCaseName,
        serviceId: selectedServiceId === 'general' ? null : selectedServiceId,
        serviceTitle: selectedServiceName,
        amount: activeAmount,
        platformTip: tipVal,
        isAnonymous,
        donorName: isAnonymous ? null : donorName,
        donorEmail,
        donorPhone,
        paymentMethod,
      };

      const created = await createDonation(payload);
      updateDonationDetails({
        ...payload,
        referenceId: created.referenceId,
        id: created.id,
      });

      navigate(`/payment/processing/${created.referenceId}`);
    } catch (err) {
      toast.error(err.message || 'تعذر إتمام أمر التبرع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800">
          <FuturisticShield className="w-6 h-6 p-1 border-none shadow-none" />
          <span>{t('checkout.secureNotice')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('checkout.title')}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t('checkout.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Selected Case Card & Representative Custom Needs Options */}
          <div className="card-base p-6 space-y-4 border-s-4 border-s-primary-600">
            <div>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                {t('checkout.selectedCase')}
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {selectedCaseName}
              </h3>
            </div>

            {/* Dynamic Representative Options Selector */}
            {availableServices.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  حدد بند التبرع المطلوب (خيارات ممثل الأسرة):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceId('general')}
                    className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all ${
                      selectedServiceId === 'general'
                        ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    ❤️ تبرع عام للأسرة (سداد الاحتياج الأكثر إلحاحاً)
                  </button>

                  {availableServices.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all ${
                        selectedServiceId === srv.id
                          ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="font-bold truncate">{isArabic ? srv.titleAr : srv.titleEn}</div>
                      {srv.unitLabelAr && (
                        <span className="text-[10px] opacity-80 block mt-0.5">({srv.unitLabelAr})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Amount Selection with Dynamic Presets */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {t('checkout.step1')}
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {activePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all text-center ${
                    !customAmount && amount === preset
                      ? 'bg-primary-700 text-white border-primary-700 shadow-sm ring-2 ring-primary-500/20'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-primary-500'
                  }`}
                >
                  {formatCurrency(preset, currentLang)}
                </button>
              ))}
            </div>

            <Input
              type="text"
              label={t('checkout.customAmount')}
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="مثال: 750"
              error={errors.amount}
            />
          </div>

          {/* 3. Donor Visibility & Information */}
          <div className="card-base p-6 space-y-5">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {t('checkout.step2')}
            </h3>

            {/* Visibility Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`p-3.5 rounded-2xl border text-xs font-bold text-center transition-all flex items-center justify-center gap-2 ${
                  isAnonymous
                    ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <FuturisticLock className="w-6 h-6 p-1 border-none shadow-none" />
                <span>{t('checkout.anonymousPrivate')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`p-3.5 rounded-2xl border text-xs font-bold text-center transition-all flex items-center justify-center gap-2 ${
                  !isAnonymous
                    ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('checkout.anonymousPublic')}</span>
              </button>
            </div>

            {isAnonymous ? (
              <p className="text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl leading-relaxed">
                {t('checkout.anonymousNotice')}
              </p>
            ) : (
              <Input
                label={t('checkout.donorName')}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="اسمك الكريم"
                icon={User}
                error={errors.donorName}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                label={t('checkout.donorEmail')}
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="name@example.com"
                icon={Mail}
                error={errors.donorEmail}
              />
              <Input
                type="tel"
                label={t('checkout.donorPhone')}
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="01012345678"
                icon={Phone}
                error={errors.donorPhone}
              />
            </div>
          </div>

          {/* 4. Platform Tip Optional Add-on */}
          <PlatformTipCheckbox
            enabled={includePlatformTip}
            onToggle={setIncludePlatformTip}
            tipAmount={platformTip}
            onTipChange={setPlatformTip}
          />

          {/* 5. Payment Methods */}
          <div className="card-base p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {t('checkout.step3')}
            </h3>
            <PaymentMethodSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>

        </div>

        {/* Right 1 Col: Summary & Checkout CTA */}
        <div className="space-y-6">
          <div className="card-base p-6 space-y-6 sticky top-28 shadow-lg">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
              {t('checkout.summaryTitle')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                <span>{t('checkout.caseDonationAmount')}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {formatCurrency(activeAmount, currentLang)}
                </span>
              </div>

              {includePlatformTip && (
                <div className="flex justify-between items-center text-primary-700 dark:text-primary-400">
                  <span>{t('checkout.platformTipAmount')}</span>
                  <span className="font-bold text-sm">
                    +{formatCurrency(platformTip, currentLang)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t('checkout.totalToPay')}
                </span>
                <span className="text-2xl font-black text-primary-700 dark:text-primary-400 font-display">
                  {formatCurrency(totalDue, currentLang)}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-stone-300 dark:border-stone-700"
                />
                <label htmlFor="terms" className="text-[11px] text-stone-500 leading-relaxed cursor-pointer">
                  {t('checkout.acceptTerms')}
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-600 font-medium">{errors.terms}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full text-base font-bold shadow-md rounded-2xl"
              isLoading={isSubmitting}
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{t('checkout.proceedToPayment')}</span>
            </Button>

            <div className="text-center text-[10px] text-stone-400 leading-relaxed">
              🔒 مدفوعات مشفرة وآمنة تماماً وفق معايير PCI-DSS وبنك مصر المركزي
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
