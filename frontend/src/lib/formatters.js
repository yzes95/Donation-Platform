import { calculateProgress, downloadReceipt } from './utils';

export { calculateProgress, downloadReceipt };

export function formatCurrency(amount, lng = 'ar') {
  const numericAmount = Number(amount) || 0;
  if (lng === 'ar') {
    const formatted = new Intl.NumberFormat('ar-EG').format(numericAmount);
    return `${formatted} ج.م`;
  }
  const formatted = new Intl.NumberFormat('en-US').format(numericAmount);
  return `EGP ${formatted}`;
}

export function formatNumber(num, lng = 'ar') {
  const n = Number(num) || 0;
  return new Intl.NumberFormat(lng === 'ar' ? 'ar-EG' : 'en-US').format(n);
}

export function formatDate(dateString, lng = 'ar') {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat(lng === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString, lng = 'ar') {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat(lng === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function maskDonorName(name, isAnonymous = false, lng = 'ar') {
  if (isAnonymous) {
    return lng === 'ar' ? 'فاعل خير (مجهول)' : 'Anonymous Donor';
  }
  if (!name) {
    return lng === 'ar' ? 'فاعل خير' : 'Kind Supporter';
  }
  return name;
}

export function maskSensitive(str) {
  if (!str || str.length < 4) return '***';
  return str.slice(0, 2) + '*'.repeat(str.length - 4) + str.slice(-2);
}
