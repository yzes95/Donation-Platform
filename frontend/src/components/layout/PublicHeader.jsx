import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../ui/Button';
import {
  Heart,
  Search,
  Menu,
  X,
  ShieldCheck,
  User,
  Compass,
  HelpCircle,
  Cloud,
  FileText,
  Smartphone,
  ChevronDown,
  ShieldAlert,
  UserCheck,
  Sparkles,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export function PublicHeader() {
  const { t, i18n } = useTranslation(['common', 'home']);
  const location = useLocation();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const { isAuthenticated, user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsMenuOpen, setPortalsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setPortalsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Compass },
    { to: '/families', label: t('nav.families'), icon: Heart },
    { to: '/support-platform', label: t('nav.supportPlatform'), icon: Cloud },
    { to: '/transparency', label: t('nav.transparency'), icon: FileText },
    { to: '/install', label: isArabic ? 'تطبيق الهاتف' : 'Mobile App', icon: Smartphone, highlight: true },
    { to: '/about', label: t('nav.about'), icon: ShieldCheck },
    { to: '/contact', label: t('nav.contact'), icon: HelpCircle },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-surface-dark/85 backdrop-blur-xl shadow-sm border-b border-stone-200/70 dark:border-stone-800/70'
        : 'bg-white/50 dark:bg-surface-dark/60 backdrop-blur-lg border-b border-stone-100/50 dark:border-stone-800/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="ltr">
        <div className="flex items-center justify-between h-20">
          
          {/* Futuristic Interactive Brand Logo - Always on the Left */}
          <BrandLogo />

          {/* Desktop Nav Links - Centered in Stable Left-to-Right Flow */}
          <nav className="hidden lg:flex items-center gap-1" dir="ltr">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 font-bold'
                      : item.highlight
                      ? 'text-teal-700 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls & CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            <Link
              to="/track"
              className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-primary-700 dark:hover:text-primary-400 px-2.5 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t('nav.trackDonation')}
            </Link>

            {/* Portals & Login Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPortalsMenuOpen(!portalsMenuOpen)}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 font-bold"
              >
                <User className="w-3.5 h-3.5 text-primary-600" />
                <span>{isAuthenticated ? (isAdmin ? t('nav.adminPortal') : t('nav.dashboard')) : (isArabic ? 'البوابات والدخول' : 'Portals & Login')}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {portalsMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-surface-darkCard border border-stone-200 dark:border-stone-800 shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95" dir={isArabic ? 'rtl' : 'ltr'}>
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      {isArabic ? 'بوابات المنصة والاعتماد' : 'Platform Portals & Access'}
                    </span>
                  </div>

                  <Link
                    to="/login"
                    onClick={() => setPortalsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary-700"
                  >
                    <User className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="font-bold">{isArabic ? 'دخول ممثل أسرة' : 'Family Rep Login'}</div>
                      <div className="text-[10px] text-stone-400">{isArabic ? 'متابعة التبرعات والاحتياجات' : 'Manage family needs'}</div>
                    </div>
                  </Link>

                  <Link
                    to="/admin/login"
                    onClick={() => setPortalsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900"
                  >
                    <ShieldAlert className="w-4 h-4 text-warm-600" />
                    <div>
                      <div className="font-bold">{isArabic ? 'بوابة المشرف والرقابة' : 'Admin & Governance Portal'}</div>
                      <div className="text-[10px] text-stone-400">{isArabic ? 'إدارة الأسر والتحقق المالي' : 'Verification & Audits'}</div>
                    </div>
                  </Link>

                  <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                    <Link
                      to="/apply-rep"
                      onClick={() => setPortalsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <div>
                        <div>{isArabic ? 'طلب اعتماد ممثل أسرة جديد' : 'Apply as Family Rep'}</div>
                        <div className="text-[10px] text-teal-700/80 dark:text-teal-400/80">{isArabic ? 'تسجيل أسرة وقبيلة للتحقق' : 'Register family case for verification'}</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/donate" className="btn-primary text-xs px-4 py-2.5 shadow-sm rounded-xl">
              <Heart className="w-4 h-4 fill-white" />
              <span>{t('nav.donateNow')}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-surface-dark px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <item.icon className="w-4 h-4 text-primary-600" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
            <Link to="/apply-rep" className="btn-warm text-xs w-full text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{isArabic ? 'تقديم طلب اعتماد ممثل أسرة' : 'Apply as Family Rep'}</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" className="btn-secondary text-xs text-center py-2.5">
                {isArabic ? 'دخول ممثل أسرة' : 'Family Rep Login'}
              </Link>
              <Link to="/admin/login" className="btn-secondary text-xs text-center py-2.5">
                {isArabic ? 'دخول المشرف' : 'Admin Login'}
              </Link>
            </div>
            <Link to="/donate" className="btn-primary text-xs w-full text-center">
              {t('nav.donateNow')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
