import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ListFilter,
  DollarSign,
  CreditCard,
  UserCheck,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminSidebar({ isCollapsed, onToggle }) {
  const { t } = useTranslation('admin');
  const { logout } = useAuth();

  const menuItems = [
    { to: '/admin', label: t('menu.overview'), icon: LayoutDashboard, end: true },
    { to: '/admin/families', label: t('menu.familyManagement'), icon: Users },
    { to: '/admin/verifications', label: t('menu.familyVerification'), icon: ShieldCheck, badge: 2 },
    { to: '/admin/needs-review', label: t('menu.needsReview'), icon: ListFilter, badge: 3 },
    { to: '/admin/donations', label: t('menu.donationsMonitoring'), icon: DollarSign },
    { to: '/admin/payments', label: t('menu.paymentsMonitoring'), icon: CreditCard },
    { to: '/admin/users', label: t('menu.userManagement'), icon: UserCheck },
    { to: '/admin/reports', label: t('menu.reports'), icon: BarChart3 },
    { to: '/admin/audit-logs', label: t('menu.auditLogs'), icon: ScrollText },
    { to: '/admin/settings', label: t('menu.platformSettings'), icon: Settings },
  ];

  return (
    <aside className={cn(
      "hidden md:flex flex-col justify-between border-e border-stone-200 dark:border-stone-800 bg-white dark:bg-surface-darkCard transition-all duration-300 z-30",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-stone-100 dark:border-stone-800">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-primary-900 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-primary-400" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-black text-lg text-stone-900 dark:text-stone-100 tracking-tight block truncate">
                  إدارة عطاء
                </span>
                <span className="text-[10px] font-semibold text-warm-600 dark:text-warm-400 block truncate">
                  لوحة الرقابة والتحكم
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

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 font-bold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/60",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-warm-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
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
          {!isCollapsed && <span>تسجيل خروج المشرف</span>}
        </button>
      </div>
    </aside>
  );
}
