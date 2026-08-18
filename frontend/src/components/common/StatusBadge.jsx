import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, AlertCircle, XCircle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export function StatusBadge({ status, className }) {
  const { t } = useTranslation('common');

  const configs = {
    // Family statuses
    pending_verification: {
      label: t('status.pending_verification'),
      icon: Clock,
      classes: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    },
    verified: {
      label: t('status.verified'),
      icon: ShieldCheck,
      classes: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    },
    suspended: {
      label: t('status.suspended'),
      icon: AlertCircle,
      classes: 'bg-orange-50 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/50',
    },
    archived: {
      label: t('status.archived'),
      icon: Clock,
      classes: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    },

    // Assistance statuses
    draft: {
      label: t('status.draft'),
      icon: Clock,
      classes: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    },
    pending_review: {
      label: t('status.pending_review'),
      icon: Clock,
      classes: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    },
    active: {
      label: t('status.active'),
      icon: Sparkles,
      classes: 'bg-primary-50 text-primary-800 dark:bg-primary-950/50 dark:text-primary-300 border-primary-200/80 dark:border-primary-800/50',
    },
    funded: {
      label: t('status.funded'),
      icon: CheckCircle2,
      classes: 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/50',
    },
    completed: {
      label: t('status.completed'),
      icon: CheckCircle2,
      classes: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    },
    rejected: {
      label: t('status.rejected'),
      icon: XCircle,
      classes: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200/80 dark:border-red-800/50',
    },

    // Donation / Payment statuses
    pending: {
      label: t('status.pending'),
      icon: Clock,
      classes: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    },
    processing: {
      label: t('status.processing'),
      icon: Clock,
      classes: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/50 animate-pulse',
    },
    successful: {
      label: t('status.successful'),
      icon: CheckCircle2,
      classes: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    },
    failed: {
      label: t('status.failed'),
      icon: XCircle,
      classes: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200/80 dark:border-red-800/50',
    },
    refunded: {
      label: t('status.refunded'),
      icon: RotateCcw,
      classes: 'bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/50',
    },
  };

  const current = configs[status] || configs.active;
  const Icon = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none transition-colors",
        current.classes,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {current.label}
    </span>
  );
}
