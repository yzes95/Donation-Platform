import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDonation } from '../../api/donations';
import { simulatePaymentFlow } from '../../api/payments';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function PaymentProcessingPage() {
  const { referenceId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('donation');
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [step, setStep] = useState(1); // 1: Pending, 2: Processing, 3: Completed, 4: Failed
  const [donation, setDonation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function runSimulation() {
      try {
        const don = await getDonation(referenceId);
        setDonation(don);

        // Step 1: Pending (800ms)
        setStep(1);
        await new Promise(r => setTimeout(r, 800));

        // Step 2: Processing Gateway (1400ms)
        setStep(2);
        const outcome = await simulatePaymentFlow(referenceId, 'successful');

        if (outcome.status === 'successful') {
          // Step 3: Success
          setStep(3);
          await new Promise(r => setTimeout(r, 600));
          navigate(`/donation/confirmation/${referenceId}`);
        } else {
          setStep(4);
          setErrorMsg(outcome.message);
        }
      } catch (err) {
        setStep(4);
        setErrorMsg(err.message || 'Payment simulation failed');
      }
    }

    runSimulation();
  }, [referenceId, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full card-base p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        
        {step === 4 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center shadow-inner">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
              {t('processing.failedTitle')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {errorMsg || t('processing.failedMessage')}
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => navigate('/donate')}
                icon={RotateCcw}
                size="md"
                className="w-full"
              >
                إعادة المحاولة بطريقة أخرى
              </Button>
              <Link to="/" className="btn-secondary text-xs w-full text-center py-2.5">
                العودة للرئيسية
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-950 border-t-primary-600 animate-spin" />
              <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display">
                {t('processing.title')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t('processing.subtitle')}
              </p>
            </div>

            {/* Stepper details */}
            <div className="space-y-2.5 text-xs text-start bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-stone-700 dark:text-stone-300 font-medium">
                  {t('processing.stepPending')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {step >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Spinner size="sm" className="shrink-0" />
                )}
                <span className={step >= 2 ? "text-stone-700 dark:text-stone-300 font-medium" : "text-stone-400"}>
                  {t('processing.stepProcessing')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {step >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shrink-0" />
                )}
                <span className={step >= 3 ? "text-stone-700 dark:text-stone-300 font-medium" : "text-stone-400"}>
                  {t('processing.stepFinalizing')}
                </span>
              </div>
            </div>

            {donation && (
              <div className="text-xs text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                مرجع المعاملة: <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{donation.referenceId}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
