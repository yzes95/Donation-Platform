import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Heart, Compass, User, Bell } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useApp } from '../../store/AppContext';
import { cn } from '../../lib/utils';

export function MobileBottomNav() {
  const { t } = useTranslation('common');
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadNotifications } = useApp();

  const links = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/families', label: t('nav.families'), icon: Compass },
    { to: '/donate', label: t('nav.donateNow'), icon: Heart, primary: true },
    {
      to: isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login',
      label: isAuthenticated ? t('nav.dashboard') : t('nav.familyLogin'),
      icon: User,
    },
    ...(isAuthenticated ? [{
      to: isAdmin ? '/admin/audit-logs' : '/dashboard/notifications',
      label: t('nav.notifications'),
      icon: Bell,
      badge: unreadNotifications,
    }] : [])
  ];

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-surface-darkCard/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "relative flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors",
                item.primary
                  ? "text-primary-700 dark:text-primary-400 font-bold"
                  : isActive
                  ? "text-primary-700 dark:text-primary-400 font-bold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-900"
              )}
            >
              {item.primary ? (
                <div className="w-10 h-10 -mt-5 rounded-full bg-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-700/30">
                  <Icon className="w-5 h-5 fill-white" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge ? (
                    <span className="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              )}
              <span className="mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
