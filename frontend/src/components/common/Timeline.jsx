import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, ShieldCheck, HeartHandshake, FileCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDateTime } from '../../lib/formatters';

export function Timeline({ donation }) {
  const { t, i18n } = useTranslation('donation');
  const currentLang = i18n.language || 'ar';

  const steps = [
    {
      id: 1,
      title: t('tracking.timelineStep1'),
      desc: 'تم تسجيل رغبة التبرع بنجاح وتوليد المرجع الإلكتروني المعتمد.',
      icon: FileCheck,
      completed: true,
      time: donation?.createdAt ? formatDateTime(donation.createdAt, currentLang) : null,
    },
    {
      id: 2,
      title: t('tracking.timelineStep2'),
      desc: 'تم استلام وتأكيد القيمة المالية عبر شبكة الدفع المعتمدة.',
      icon: CheckCircle2,
      completed: donation?.status === 'completed' || donation?.status === 'processing',
      active: donation?.status === 'processing',
      time: donation?.createdAt ? formatDateTime(donation.createdAt, currentLang) : null,
    },
    {
      id: 3,
      title: t('tracking.timelineStep3'),
      desc: 'إيداع المبلغ في المحفظة المخصصة لتنفيذ احتياج الحالة الإنسانية.',
      icon: ShieldCheck,
      completed: donation?.status === 'completed',
      active: donation?.status === 'completed' && !donation?.deliveredAt,
      time: donation?.deliveredAt ? formatDateTime(donation.deliveredAt, currentLang) : null,
    },
    {
      id: 4,
      title: t('tracking.timelineStep4'),
      desc: 'صرف وسداد الخدمة الطبية / الإيجار / المستلزمات لمستحقيها.',
      icon: HeartHandshake,
      completed: Boolean(donation?.deliveredAt),
      time: donation?.deliveredAt ? formatDateTime(donation.deliveredAt, currentLang) : null,
    },
    {
      id: 5,
      title: t('tracking.timelineStep5'),
      desc: 'اكتمال تنفيذ الخدمة بالكامل وإرفاق فواتير التوثيق في سجلات الرقابة.',
      icon: CheckCircle2,
      completed: Boolean(donation?.deliveredAt),
    }
  ];

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:start-4 before:h-full before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="relative flex items-start gap-4 ps-2">
            {/* Dot/Icon */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors shadow-sm",
              step.completed
                ? "bg-primary-700 text-white ring-4 ring-primary-100 dark:ring-primary-950"
                : step.active
                ? "bg-blue-600 text-white animate-pulse ring-4 ring-blue-100 dark:ring-blue-950"
                : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-300 dark:border-stone-700"
            )}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5 bg-white dark:bg-surface-darkCard border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4 className={cn(
                  "text-sm font-bold",
                  step.completed ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500"
                )}>
                  {step.title}
                </h4>
                {step.time && (
                  <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                    {step.time}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
