import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../store/AuthContext';
import { Bell, ShieldCheck, Activity } from 'lucide-react';

export function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-surface-darkCard border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 flex items-center justify-between z-20" dir="ltr">
      <div className="text-start" dir={document.documentElement.dir || 'rtl'}>
        <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* System Health indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>الخوادم: تعمل بكفاءة (AWS)</span>
        </div>

        <LanguageSwitcher />
        <ThemeToggle />

        <div className="flex items-center gap-2 ps-2 border-s border-stone-200 dark:border-stone-800">
          <Avatar name={user?.name || 'Admin'} size="sm" />
          <div className="hidden lg:block text-start">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
              {user?.name || 'د. يحيى الشريف'}
            </span>
            <span className="text-[10px] text-warm-600 dark:text-warm-400 block font-semibold">
              مسؤول النظام والرقابة
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
