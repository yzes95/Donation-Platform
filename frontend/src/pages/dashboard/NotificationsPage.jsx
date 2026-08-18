import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotifications, markAsRead, markAllRead } from '../../api/notifications';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateTime } from '../../lib/formatters';
import { Bell, CheckCheck, Heart, ShieldCheck, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('تم تحديد جميع الإشعارات كمقروءة');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        title="مركز الإشعارات والتنبيهات"
        subtitle="متابعة مستمرة للتبرعات الجديدة، تحديثات الحالات، والاعتمادات"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500">
            إجمالي الإشعارات: {notifications.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            icon={CheckCheck}
            className="text-xs text-primary-700 dark:text-primary-400"
          >
            تحديد الكل كمقروء
          </Button>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`card-base p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all ${
                  !n.read
                    ? 'border-s-4 border-s-primary-600 bg-primary-50/20 dark:bg-primary-950/20'
                    : 'opacity-80'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {isArabic ? n.titleAr : n.titleEn}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {formatDateTime(n.createdAt, currentLang)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {isArabic ? n.messageAr : n.messageEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="لا توجد إشعارات جديدة"
            description="ستصلك إشعارات وتنبيهات فورية عند وصول تبرع جديد أو اعتماد خدمة."
          />
        )}

      </div>
    </div>
  );
}
