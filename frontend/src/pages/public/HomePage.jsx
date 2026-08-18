import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFamilies } from '../../api/families';
import { mockStatistics } from '../../data/statistics';
import { FamilyCard } from '../../components/common/FamilyCard';
import { CostBreakdownCard } from '../../components/common/CostBreakdownCard';
import { FamilyCardSkeleton } from '../../components/ui/Skeleton';
import { FuturisticLock, FuturisticHeart, FuturisticShield, FuturisticCloud, FuturisticLamp } from '../../components/common/InteractiveIcon';
import { Button } from '../../components/ui/Button';
import { AssistanceCategories, OperationalCostCategories } from '../../lib/constants';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import {
  Heart,
  Search,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Cloud,
  Lock,
  Eye,
  Award,
  Sparkles,
  Smartphone,
  Stethoscope,
  Home as HomeIcon,
  GraduationCap,
  Utensils,
  ShieldAlert,
  HeartHandshake,
  Flame,
  Download
} from 'lucide-react';

const categoryIcons = {
  medical: Stethoscope,
  housing: HomeIcon,
  education: GraduationCap,
  food: Utensils,
  debt_relief: ShieldAlert,
  orphan_care: HeartHandshake,
  emergencies: Flame,
};

export function HomePage() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const navigate = useNavigate();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFamilies();
        setFamilies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/families?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/families');
    }
  };

  const urgentFamilies = families.filter(f => f.urgency === 'critical');
  const featuredFamilies = families.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary-50/60 via-surface-light to-surface-light dark:from-primary-950/20 dark:via-surface-dark dark:to-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/80 dark:bg-primary-950/80 text-primary-800 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800/60 shadow-sm animate-pulseGlow">
              <Sparkles className="w-4 h-4 text-warm-500 shrink-0" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15] font-display">
              {t('hero.title')}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {t('hero.description')}
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleSearch} className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl sm:rounded-3xl bg-white dark:bg-surface-darkCard shadow-xl border border-stone-200/80 dark:border-stone-800">
                <div className="flex-1 flex items-center gap-3 ps-4 w-full">
                  <Search className="w-5 h-5 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full bg-transparent border-none text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl text-sm whitespace-nowrap shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('common:actions.search')}</span>
                </button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/families" className="btn-secondary text-xs px-5 py-2.5">
                <Compass className="w-4 h-4 text-primary-600" />
                <span>{t('hero.browseCta')}</span>
              </Link>
              <Link to="/install" className="btn-outline text-xs px-5 py-2.5 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800 flex items-center gap-1.5 font-bold">
                <Smartphone className="w-4 h-4" />
                <span>{isArabic ? 'استخدم التطبيق على الهاتف' : 'Install Mobile App'}</span>
              </Link>
              <Link to="/support-platform" className="btn-outline text-xs px-5 py-2.5 text-warm-600 dark:text-warm-400 border-warm-300 dark:border-warm-800/80">
                <Cloud className="w-4 h-4" />
                <span>{t('hero.supportPlatformCta')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="text-center space-y-1 p-3">
            <div className="text-2xl sm:text-4xl font-black text-primary-700 dark:text-primary-400 font-display">
              {formatCurrency(mockStatistics.totalDonationsAmount, currentLang)}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              {t('stats.totalDonated')}
            </p>
          </div>
          <div className="text-center space-y-1 p-3 border-s border-stone-100 dark:border-stone-800">
            <div className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
              {formatNumber(mockStatistics.familiesCount, currentLang)}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              {t('stats.familiesHelped')}
            </p>
          </div>
          <div className="text-center space-y-1 p-3 border-s border-stone-100 dark:border-stone-800">
            <div className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
              {formatNumber(mockStatistics.completedNeedsCount, currentLang)}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              {t('stats.completedNeeds')}
            </p>
          </div>
          <div className="text-center space-y-1 p-3 border-s border-stone-100 dark:border-stone-800">
            <div className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              {mockStatistics.verificationRate}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              {t('stats.verifiedRate')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. URGENT ASSISTANCE NEEDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-bold mb-1">
              <Flame className="w-4 h-4 fill-red-500" />
              <span>{isArabic ? 'أولوية قصوى' : 'Critical Urgency'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              {t('urgentNeeds.title')}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t('urgentNeeds.subtitle')}
            </p>
          </div>
          <Link
            to="/families?urgency=critical"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 transition-colors"
          >
            <span>{t('urgentNeeds.viewAll')}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => <FamilyCardSkeleton key={i} />)
          ) : (
            urgentFamilies.slice(0, 3).map((f) => (
              <FamilyCard key={f.id} family={f} />
            ))
          )}
        </div>
      </section>

      {/* 4. CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('categories.title')}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {AssistanceCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Heart;
            return (
              <Link
                key={cat.id}
                to={`/families?category=${cat.id}`}
                className="group card-hover p-4 text-center flex flex-col items-center justify-center space-y-2.5 rounded-2xl"
              >
                <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 group-hover:scale-110 group-hover:bg-primary-700 group-hover:text-white transition-all duration-200 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {isArabic ? cat.nameAr : cat.nameEn}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED FAMILIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              {t('featuredFamilies.title')}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t('featuredFamilies.subtitle')}
            </p>
          </div>
          <Link
            to="/families"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 transition-colors"
          >
            <span>{t('featuredFamilies.viewDirectory')}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <FamilyCardSkeleton key={i} />)
          ) : (
            featuredFamilies.map((f) => (
              <FamilyCard key={f.id} family={f} />
            ))
          )}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-stone-100 shadow-xl space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t('howItWorks.title')}
            </h2>
            <p className="text-sm text-stone-400">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/30 text-primary-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-white">
                {t('howItWorks.step1Title')}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {t('howItWorks.step1Desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-warm-600/30 text-warm-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-white">
                {t('howItWorks.step2Title')}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {t('howItWorks.step2Desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-white">
                {t('howItWorks.step3Title')}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {t('howItWorks.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST & TRANSPARENCY SECTION WITH FUTURISTIC INTERACTIVE ICONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1 rounded-full border border-primary-200 dark:border-primary-900">
            <FuturisticShield className="w-5 h-5 p-0.5 border-none shadow-none" />
            <span>{isArabic ? 'معايير الأمان والنزاهة' : 'Security & Trust Standards'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('trust.title')}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t('trust.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-hover p-6 space-y-3">
            <FuturisticShield />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('trust.point1Title')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('trust.point1Desc')}
            </p>
          </div>

          <div className="card-hover p-6 space-y-3">
            <FuturisticLock />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('trust.point2Title')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('trust.point2Desc')}
            </p>
          </div>

          <div className="card-hover p-6 space-y-3">
            <FuturisticLamp />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('trust.point3Title')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('trust.point3Desc')}
            </p>
          </div>

          <div className="card-hover p-6 space-y-3">
            <FuturisticCloud />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('trust.point4Title')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('trust.point4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 8. PWA MOBILE APP PROMOTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-900 via-primary-950 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-500/30">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 text-teal-200 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تطبيق PWA بدون متجر تطبيقات' : 'Fast PWA (No App Store Required)'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              {isArabic ? 'ثبّت منصة عطاء كتطبيق على شاشة هاتفك' : 'Install Ataa Directly on Your Phone'}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
              {isArabic
                ? 'احصل على تجربة فائقة السرعة مع إمكانية التتبع بدون اتصال وتنبيهات فورية عند وصول تبرعات للحالات.'
                : 'Enjoy lightning-fast access with offline receipt viewing and instant push notifications for donation milestones.'}
            </p>
          </div>
          <Link
            to="/install"
            className="btn-primary text-xs px-6 py-3.5 rounded-2xl whitespace-nowrap shadow-lg shrink-0 font-bold bg-teal-500 hover:bg-teal-400 text-stone-950"
          >
            <Download className="w-4 h-4" />
            <span>{isArabic ? 'طريقة تثبيت التطبيق 📱' : 'How to Install 📱'}</span>
          </Link>
        </div>
      </section>

      {/* 9. SUPPORT PLATFORM OPERATIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary-800 via-primary-900 to-stone-900 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-primary-700/40">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-700/60 text-primary-200 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استقلالية تامة وشفافية 100%' : '100% Transparency & Independence'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              {t('supportPlatformBanner.title')}
            </h3>
            <p className="text-xs sm:text-sm text-primary-100/80 leading-relaxed">
              {t('supportPlatformBanner.description')}
            </p>
          </div>
          <Link
            to="/support-platform"
            className="btn-warm text-sm px-6 py-3.5 rounded-2xl whitespace-nowrap shadow-lg shrink-0 font-bold"
          >
            <Cloud className="w-4 h-4" />
            <span>{t('supportPlatformBanner.cta')}</span>
          </Link>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-10">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
            {t('ctaSection.title')}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t('ctaSection.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/families" className="btn-primary text-sm px-8 py-3.5 rounded-2xl font-bold shadow-md">
            <Heart className="w-5 h-5 fill-white" />
            <span>{t('ctaSection.donateNow')}</span>
          </Link>
          <Link to="/apply-rep" className="btn-secondary text-sm px-6 py-3.5 rounded-2xl font-semibold">
            <span>{isArabic ? 'تقديم طلب اعتماد ممثل أسرة' : 'Apply as Family Representative'}</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
