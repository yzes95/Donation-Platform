export const FamilyStatus = {
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
};

export const AssistanceStatus = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  ACTIVE: 'active',
  FUNDED: 'funded',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const DonationStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PaymentMethods = [
  {
    id: 'instapay',
    nameEn: 'InstaPay Egypt',
    nameAr: 'إنستاباي مصر',
    icon: 'Zap',
    badgeAr: 'فوري وسريع',
    badgeEn: 'Instant',
    descriptionAr: 'تحويل بنكي فوري عبر شبكة المدفوعات اللحظية المصرية',
    descriptionEn: 'Instant direct bank transfer across Egyptian banks',
    popular: true,
  },
  {
    id: 'vodafone_cash',
    nameEn: 'Vodafone Cash & Wallets',
    nameAr: 'فودافون كاش والمحافظ الإلكترونية',
    icon: 'Smartphone',
    badgeAr: 'الأكثر شيوعاً',
    badgeEn: 'Popular',
    descriptionAr: 'فودافون كاش، أورنج كاش، اتصالات كاش، وي باي',
    descriptionEn: 'Vodafone Cash, Orange Money, Etisalat Cash, WE Pay',
    popular: true,
  },
  {
    id: 'card',
    nameEn: 'Debit / Credit Card',
    nameAr: 'بطاقة بنكية (فيزا / ماستركارد / ميزة)',
    icon: 'CreditCard',
    badgeAr: 'آمن ومباشر',
    badgeEn: 'Secure',
    descriptionAr: 'فيزا، ماستركارد، بطاقة ميزة',
    descriptionEn: 'Visa, MasterCard, Meeza national cards',
    popular: true,
  },
  {
    id: 'paypal',
    nameEn: 'PayPal (International)',
    nameAr: 'باي بال (للتبرع الدولي)',
    icon: 'Globe',
    badgeAr: 'للمغتربين',
    badgeEn: 'Worldwide',
    descriptionAr: 'للمتبرعين من خارج مصر بأي عملة أجنبية',
    descriptionEn: 'For international donors in USD, EUR, SAR, AED',
    popular: false,
  },
  {
    id: 'fawry',
    nameEn: 'Fawry Pay',
    nameAr: 'خدمة فوري',
    icon: 'Receipt',
    badge: 'كود دفع / Pay Code',
    descriptionAr: 'الحصول على كود دفع والسداد من أي منفذ فوري',
    descriptionEn: 'Get a reference code and pay at any Fawry kiosk',
    popular: false,
  },
];

export const AssistanceCategories = [
  { id: 'medical', nameAr: 'علاج ورعاية صحية', nameEn: 'Medical & Healthcare', icon: 'Stethoscope', color: 'rose' },
  { id: 'housing', nameAr: 'إسكان وترميم', nameEn: 'Housing & Shelter', icon: 'Home', color: 'amber' },
  { id: 'education', nameAr: 'تعليم ورسوم مدرسية', nameEn: 'Education & Tuition', icon: 'GraduationCap', color: 'blue' },
  { id: 'food', nameAr: 'سلال غذائية وإطعام', nameEn: 'Food Supplies & Nutrition', icon: 'Utensils', color: 'emerald' },
  { id: 'debt_relief', nameAr: 'فك كرب وغارمين', nameEn: 'Debt Relief & Solvency', icon: 'ShieldAlert', color: 'purple' },
  { id: 'orphan_care', nameAr: 'كفالة أيتام', nameEn: 'Orphan Sponsorship', icon: 'HeartHandshake', color: 'pink' },
  { id: 'emergencies', nameAr: 'طوارئ وإغاثة عاجلة', nameEn: 'Urgent Emergencies', icon: 'Flame', color: 'red' },
];

export const UrgencyLevels = {
  CRITICAL: { id: 'critical', nameAr: 'حرج للغاية', nameEn: 'Critical', color: 'red' },
  HIGH: { id: 'high', nameAr: 'عالي الأولوية', nameEn: 'High Priority', color: 'amber' },
  MEDIUM: { id: 'medium', nameAr: 'متوسط', nameEn: 'Medium Priority', color: 'blue' },
  LOW: { id: 'low', nameAr: 'عادي', nameEn: 'Standard', color: 'stone' },
};

export const PlatformPresetAmounts = [50, 100, 250, 500, 1000];
export const FamilyPresetAmounts = [100, 250, 500, 1000, 2500, 5000];

export const OperationalCostCategories = [
  {
    id: 'aws_hosting',
    nameAr: 'الاستضافة السحابية (AWS)',
    nameEn: 'Cloud Hosting (AWS)',
    descriptionAr: 'خوادم EC2/ECS، شبكات التوزيع CloudFront، وتخزين S3 للمستندات الآمنة',
    descriptionEn: 'EC2/ECS servers, CloudFront CDN distribution, and secure S3 storage',
    monthlyTarget: 4500,
    currentRaised: 3600,
    icon: 'Cloud',
  },
  {
    id: 'database',
    nameAr: 'قواعد البيانات والنسخ الاحتياطي',
    nameEn: 'Databases & Backup Systems',
    descriptionAr: 'قاعدة بيانات PostgreSQL المدارة بنظام توفر عالٍ وتشفير متقدم',
    descriptionEn: 'High-availability managed PostgreSQL with automated encrypted backups',
    monthlyTarget: 3000,
    currentRaised: 2850,
    icon: 'Database',
  },
  {
    id: 'payment_gateways',
    nameAr: 'رسوم بوابات الدفع الإلكتروني',
    nameEn: 'Payment Gateway Licensing & Fees',
    descriptionAr: 'تغطية عمولات التحويلات البنكية ومحافظ الهاتف لضمان وصول 100% للأسر',
    descriptionEn: 'Absorbing transaction fees so 100% of donor pledges reach families',
    monthlyTarget: 5000,
    currentRaised: 4100,
    icon: 'CreditCard',
  },
  {
    id: 'comms',
    nameAr: 'خدمات الرسائل والإشعارات (SMS / Email)',
    nameEn: 'Notification & SMS Services',
    descriptionAr: 'إرسال تأكيدات التبرع وتنبيهات الأسر عبر الرسائل النصية القصيرة',
    descriptionEn: 'Transactional SMS alerts and confirmation emails to donors and families',
    monthlyTarget: 1800,
    currentRaised: 1400,
    icon: 'MessageSquare',
  },
  {
    id: 'security_audits',
    nameAr: 'الأمان وحماية البيانات والتدقيق',
    nameEn: 'Security & Compliance Audits',
    descriptionAr: 'شهادات SSL، حماية جدار الحماية WAF، وتدقيق دوري لخصوصية الأسر',
    descriptionEn: 'SSL certificates, AWS WAF protection, and privacy compliance audits',
    monthlyTarget: 2200,
    currentRaised: 2200,
    icon: 'ShieldCheck',
  },
  {
    id: 'dev_maintenance',
    nameAr: 'التطوير والصيانة المستمرة',
    nameEn: 'Engineering & PWA Enhancements',
    descriptionAr: 'تحديثات المنصة البرمجية وتطوير أدوات الباحث الميداني وخدمة العملاء',
    descriptionEn: 'Continuous software improvements, field worker tools, and platform support',
    monthlyTarget: 3500,
    currentRaised: 2900,
    icon: 'Cpu',
  },
];
