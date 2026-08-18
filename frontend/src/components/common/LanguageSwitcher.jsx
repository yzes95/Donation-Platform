import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors select-none ${className}`}
      aria-label="Switch Language"
    >
      <Globe className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      <span>{currentLang.startsWith('ar') ? 'English' : 'العربية'}</span>
    </button>
  );
}
