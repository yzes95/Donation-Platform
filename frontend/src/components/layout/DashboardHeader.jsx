import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../store/AuthContext';
import { useApp } from '../../store/AppContext';
import { Bell, Heart, ExternalLink } from 'lucide-react';

export function DashboardHeader({ title, subtitle }) {
  const { user } = useAuth();
  const { unreadNotifications } = useApp();

  return (
    <header className="h-20 bg-white dark:bg-surface-darkCard border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 flex items-center justify-between z-20">
      <div>
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
        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700"
        >
          <span>زيارة الموقع العام</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <LanguageSwitcher />
        <ThemeToggle />

        <Link
          to="/dashboard/notifications"
          className="relative p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </Link>

        <div className="flex items-center gap-2 ps-2 border-s border-stone-200 dark:border-stone-800">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="hidden lg:block text-start">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
              {user?.name}
            </span>
            <span className="text-[10px] text-stone-400 block">
              ممثل أسرة معتمد
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
