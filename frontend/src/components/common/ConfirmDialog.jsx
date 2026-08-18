import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأكيد الإجراء',
  message = 'هل أنت متأكد من رغبتك في متابعة هذا الإجراء؟',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
        <Button variant="secondary" onClick={onClose} disabled={isLoading} size="sm">
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading} size="sm">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
