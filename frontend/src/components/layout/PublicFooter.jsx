import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '../common/BrandLogo';
import { Heart, ShieldCheck, Lock, Mail, Phone, MapPin, Cloud, Smartphone, Sparkles } from 'lucide-react';

export function PublicFooter() {
  const { t, i18n } = useTranslation(['common', 'home']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {isArabic
                ? 'منصة غير ربحية موثوقة للتمكين المالي المباشر للأسر المتعففة وتغطية الاحتياجات الأساسية والخدمات الطبية والسكنية والتعليمية بشفافية 100%.'
                : 'A verified non-profit fintech platform for direct family financial empowerment, covering essential medical, housing, and educational needs with 100% transparency.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'تحقق ميداني معتمد' : 'Field Verified'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary-400" />
                <span>{isArabic ? 'تشفير آمن 100%' : '256-bit Encrypted'}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">{t('general.quickLinks')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/families" className="hover:text-white transition-colors">{t('nav.families')}</Link></li>
              <li><Link to="/donate" className="hover:text-white transition-colors">{t('nav.donateNow')}</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">{t('nav.trackDonation')}</Link></li>
              <li>
                <Link to="/install" className="text-teal-400 hover:text-teal-300 font-bold transition-colors flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تثبيت التطبيق على الهاتف' : 'Install Mobile PWA'}</span>
                </Link>
              </li>
              <li>
                <Link to="/apply-rep" className="text-warm-400 hover:text-warm-300 font-bold transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'طلب اعتماد ممثل أسرة' : 'Apply as Family Rep'}</span>
                </Link>
              </li>
              <li><Link to="/support-platform" className="hover:text-white text-warm-400 font-semibold transition-colors flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5" />
                <span>{t('nav.supportPlatform')}</span>
              </Link></li>
              <li><Link to="/transparency" className="hover:text-white transition-colors">{t('nav.transparency')}</Link></li>
            </ul>
          </div>

          {/* Portals & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">{isArabic ? 'البوابات والنزاهة' : 'Portals & Trust'}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">{isArabic ? 'بوابة ممثلي الأسر' : 'Family Rep Portal'}</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">{isArabic ? 'بوابة المشرف والرقابة' : 'Admin Governance Portal'}</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">{t('general.supportTitle')}</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@ataa.platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span dir="ltr">+20 100 000 2822</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{isArabic ? 'القاهرة وشمال سيناء، جمهورية مصر العربية' : 'Cairo & Sinai, Egypt'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {t('general.allRightsReserved')}</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">
              {isArabic ? 'مبني وفق معايير PWA الفائقة وتوافق FastAPI' : 'Built as High-Performance PWA & FastAPI Ready'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
