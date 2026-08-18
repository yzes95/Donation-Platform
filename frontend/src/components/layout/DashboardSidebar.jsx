import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard,
  Users,
  ListTodo,
  PlusCircle,
  History,
  Bell,
  Settings,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function DashboardSidebar({ isCollapsed, onToggle }) {
  const { t, i18n } = useTranslation('dashboard');
  const { user, logout } = useAuth();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const menuItems = [
    { to: '/dashboard', label: t('menu.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/dashboard/profile', label: t('menu.familyProfile'), icon: Users },
    { to: '/dashboard/needs', label: t('menu.needsManagement'), icon: ListTodo },
    { to: '/dashboard/needs/create', label: t('menu.createRequest'), icon: PlusCircle },
    { to: '/dashboard/donations', label: t('menu.donationHistory'), icon: History },
    { to: '/dashboard/notifications', label: t('menu.notifications'), icon: Bell },
    { to: '/dashboard/settings', label: t('menu.settings'), icon: Settings },
  ];

  return (
    <aside className={cn(
      "hidden md:flex flex-col justify-between border-e border-stone-200 dark:border-stone-800 bg-white dark:bg-surface-darkCard transition-all duration-300 z-30",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between h-20 px-4 border-b border-stone-100 dark:border-stone-800">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-black text-lg text-stone-900 dark:text-stone-100 tracking-tight block truncate">
                  منصة عطاء
                </span>
                <span className="text-[10px] font-semibold text-primary-700 dark:text-primary-400 block truncate">
                  بوابة ممثل الأسرة
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4 rtl:rotate-180" /> : <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
          </button>
        </div>

        {/* User Card Tag */}
        {!isCollapsed && user && (
          <div className="mx-3 my-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
              كود الملف: {user.familyId || 'FAM-1042'}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 font-bold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/60",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? 'تسجيل الخروج' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
