import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'حدث خطأ في تحميل البيانات',
  message = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl my-6">
      <div className="p-3.5 bg-red-100 dark:bg-red-900/50 rounded-2xl text-red-600 dark:text-red-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-red-900 dark:text-red-200 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-red-700/80 dark:text-red-300/80 max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" icon={RotateCcw}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
