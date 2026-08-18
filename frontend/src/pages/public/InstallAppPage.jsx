import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  Sparkles,
  CheckCircle2,
  Zap,
  Bell,
  WifiOff,
  ShieldCheck,
  Laptop,
  Globe,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';

export function InstallAppPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [activePlatform, setActivePlatform] = useState('ios'); // 'ios' | 'android' | 'desktop'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect OS default
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setActivePlatform('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setActivePlatform('ios');
    } else {
      setActivePlatform('desktop');
    }

    // Check if running as installed PWA standalone
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt for Android/Desktop Chrome
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success(isArabic ? 'تم تثبيت تطبيق عطاء بنجاح على جهازك!' : 'Ataa app installed successfully!');
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      toast.info(
        isArabic
          ? 'اتبع الخطوات الموضحة بالأسفل لتثبيت التطبيق مباشرة من متصفحك'
          : 'Follow the steps below to add the app from your browser'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-800 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800 shadow-sm">
          <Smartphone className="w-4 h-4 text-primary-600" />
          <span>{isArabic ? 'تطبيق الويب التقدمي (PWA)' : 'Progressive Web App (PWA)'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 font-display">
          {isArabic ? 'استخدم منصة عطاء كتطبيق على هاتفك' : 'Install Ataa Directly on Your Phone'}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
          {isArabic
            ? 'يمكنك تثبيت منصة عطاء كتطبيق فوري على شاشة هاتفك الرئيسية دون الحاجة لتنزيل من متجر التطبيقات، مع تجربة سريعة وخفيفة وتنبيهات فورية للتبرعات.'
            : 'Install Ataa directly onto your home screen without downloading from app stores. Fast, lightweight, with offline capabilities and real-time alerts.'}
        </p>

        {/* Live Install Button for supported browsers */}
        {deferredPrompt && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleInstallClick}
              icon={Download}
              className="px-8 py-3.5 text-sm font-bold shadow-lg rounded-2xl animate-bounce"
            >
              {isArabic ? 'تثبيت التطبيق الآن بضغطة واحدة' : 'Install App Now (1-Click)'}
            </Button>
          </div>
        )}
      </div>

      {/* 2. PLATFORM TABS */}
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 justify-center gap-2">
          <button
            type="button"
            onClick={() => setActivePlatform('ios')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'ios'
                ? 'bg-white dark:bg-stone-900 text-primary-700 dark:text-primary-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone / iPad (iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('android')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'android'
                ? 'bg-white dark:bg-stone-900 text-primary-700 dark:text-primary-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Chrome / Samsung)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('desktop')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'desktop'
                ? 'bg-white dark:bg-stone-900 text-primary-700 dark:text-primary-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>كمبيوتر / PC (Chrome / Edge)</span>
          </button>
        </div>

        {/* 3. STEP-BY-STEP INSTRUCTIONS */}
        <div className="space-y-4">
          {activePlatform === 'ios' && (
            <div className="space-y-4">
              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-primary-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      افتح الموقع في متصفح Safari
                    </h3>
                    <p className="text-xs text-stone-500">
                      تأكد من فتح رابط المنصة في متصفح سفاري على جهاز الآيفون.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-warm-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>اضغط على زر المشاركة (Share)</span>
                      <Share2 className="w-4 h-4 text-warm-600 inline" />
                    </h3>
                    <p className="text-xs text-stone-500">
                      موجود في أسفل شاشة المتصفح (مربع يخرج منه سهم للأعلى).
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-emerald-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>اختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</span>
                      <PlusSquare className="w-4 h-4 text-emerald-600 inline" />
                    </h3>
                    <p className="text-xs text-stone-500">
                      ثم اضغط (إضافة / Add) في الزاوية العلوية ليظهر التطبيق مع باقي تطبيقات هاتفك.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activePlatform === 'android' && (
            <div className="space-y-4">
              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-primary-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      افتح الموقع في Google Chrome أو Samsung Internet
                    </h3>
                    <p className="text-xs text-stone-500">
                      تصفح منصة عطاء عبر متصفحك المفضل على جهاز أندرويد.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-warm-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      اضغط على قائمة الخيارات (الثلاث نقاط ⋮) في أعلى المتصفح
                    </h3>
                    <p className="text-xs text-stone-500">
                      ستظهر لك قائمة خيارات المتصفح.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-emerald-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>اختر "تثبيت التطبيق" (Install App) أو "إضافة للشاشة الرئيسية"</span>
                      <Download className="w-4 h-4 text-emerald-600 inline" />
                    </h3>
                    <p className="text-xs text-stone-500">
                      اضغط تثبيت وسيتم تحميل أيقونة التطبيق واستخدامه بشكل كامل دون فتح المتصفح.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-4">
              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-primary-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      انظر لشريط العنوان (URL Bar) في متصفح Chrome أو Edge
                    </h3>
                    <p className="text-xs text-stone-500">
                      ستجد أيقونة تثبيت صغيرة (شاشة مع سهم للأسفل) في نهاية شريط العنوان.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4 border-s-4 border-s-emerald-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      اضغط "تثبيت عطاء" (Install Ataa)
                    </h3>
                    <p className="text-xs text-stone-500">
                      سيتم فتح التطبيق في نافذة مستقلة وسريعة مع أيقونة على سطح المكتب وشريط المهام.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 4. WHY INSTALL AS PWA (BENEFITS) */}
      <div className="space-y-8 pt-8 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {isArabic ? 'لماذا تستخدم تطبيق عطاء على الهاتف؟' : 'Why Install the Ataa App?'}
          </h2>
          <p className="text-xs text-stone-500">
            {isArabic ? 'مزايا حصرية للتطبيق المباشر' : 'Exclusive benefits of the direct PWA app'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              سرعة فائقة واستجابة فورية
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              يعمل التطبيق بدون أي انتظار وتفتح الشاشات والتبرع في أجزاء من الثانية.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 w-fit">
              <WifiOff className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              تصفح وتتبع عند انقطاع الإنترنت
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              إمكانية الوصول للإيصالات السابقة وأرقام المراجع المحفوظة حتى بدون اتصال.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 w-fit">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              إشعارات فورية لحالات الطوارئ
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              تنبيهات عاجلة للعمليات الجراحية الحرجة وتحديثات تسليم التبرعات لأصحابها.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              مساحة 0 ميجابايت تقريباً
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              لا يستهلك ذاكرة هاتفك ولا يحتاج لتحديثات يدوية من متجر التطبيقات.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}
