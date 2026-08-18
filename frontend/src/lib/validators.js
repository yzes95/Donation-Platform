export function validateEmail(email) {
  if (!email) return true; // optional in many donor forms
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  if (!phone) return true;
  // Egyptian mobile format: 010, 011, 012, 015 with 11 digits
  const re = /^(\+?20|0)?1[0125][0-9]{8}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
}

export function validateNationalId(nationalId) {
  if (!nationalId) return false;
  // Egyptian National ID: 14 digits
  return /^[23][0-9]{13}$/.test(nationalId);
}

export function validateDonationAmount(amount, min = 10, max = 500000) {
  const num = Number(amount);
  if (isNaN(num)) return { valid: false, messageAr: 'يرجى إدخال مبلغ صحيح', messageEn: 'Please enter a valid amount' };
  if (num < min) return { valid: false, messageAr: `الحد الأدنى للتبرع هو ${min} ج.م`, messageEn: `Minimum donation is EGP ${min}` };
  if (num > max) return { valid: false, messageAr: `الحد الأقصى للتبرع هو ${max} ج.م`, messageEn: `Maximum donation is EGP ${max}` };
  return { valid: true };
}
