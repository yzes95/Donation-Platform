import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(prefix = 'REF') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function calculateProgress(current, target) {
  if (!target || target <= 0) return 0;
  const percentage = Math.round((current / target) * 100);
  return Math.min(percentage, 100);
}

export function downloadReceipt(donation) {
  const content = `
========================================
       منصة عطاء — إيصال تبرع رسمي
       ATAA DONATION PLATFORM RECEIPT
========================================

رقم المعاملة / Ref ID: ${donation.referenceId || donation.id}
التاريخ / Date: ${new Date(donation.createdAt).toLocaleString('ar-EG')}
المبلغ / Amount: ${donation.amount} ج.م / EGP
نوع التبرع / Type: ${donation.type === 'platform' ? 'دعم منصة عطاء' : 'تبرع لأسرة'}
${donation.familyName ? `الأسرة / Family: ${donation.familyName}` : ''}
${donation.serviceTitle ? `الخدمة / Service: ${donation.serviceTitle}` : ''}
المتبرع / Donor: ${donation.isAnonymous ? 'فاعل خير (مجهول / Anonymous)' : donation.donorName || 'مشارك كريم'}
طريقة الدفع / Payment Method: ${donation.paymentMethod}
حالة التبرع / Status: ${donation.status}

شكراً لمساهمتكم الكريمة في إدخال السرور وتفريج الكرب.
Thank you for your generous support!
========================================
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ataa-Receipt-${donation.referenceId || donation.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
