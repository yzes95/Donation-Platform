import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Arabic translations
import arCommon from './locales/ar/common.json';
import arHome from './locales/ar/home.json';
import arFamilies from './locales/ar/families.json';
import arDonation from './locales/ar/donation.json';
import arDashboard from './locales/ar/dashboard.json';
import arAdmin from './locales/ar/admin.json';
import arPlatform from './locales/ar/platform.json';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enFamilies from './locales/en/families.json';
import enDonation from './locales/en/donation.json';
import enDashboard from './locales/en/dashboard.json';
import enAdmin from './locales/en/admin.json';
import enPlatform from './locales/en/platform.json';

const resources = {
  ar: {
    common: arCommon,
    home: arHome,
    families: arFamilies,
    donation: arDonation,
    dashboard: arDashboard,
    admin: arAdmin,
    platform: arPlatform,
  },
  en: {
    common: enCommon,
    home: enHome,
    families: enFamilies,
    donation: enDonation,
    dashboard: enDashboard,
    admin: enAdmin,
    platform: enPlatform,
  }
};

// Default is Arabic ('ar') as confirmed
const savedLanguage = localStorage.getItem('ataa_language') || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ar',
    defaultNS: 'common',
    ns: ['common', 'home', 'families', 'donation', 'dashboard', 'admin', 'platform'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ataa_language',
      caches: ['localStorage'],
    }
  });

export function updateDocumentDirection(lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('ataa_language', lang);
}

// Initial setup
updateDocumentDirection(savedLanguage);

i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

export default i18n;
