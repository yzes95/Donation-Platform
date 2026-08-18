import { OperationalCostCategories } from '../lib/constants';

export const mockPlatformData = {
  monthlyTarget: 20000,
  currentRaised: 17050,
  donorsCount: 88,
  costs: OperationalCostCategories,
  donations: [
    {
      id: 'pld-01',
      referenceId: 'REF-PLAT-901',
      amount: 1000,
      donorName: 'شركة النيل للتقنية',
      paymentMethod: 'card',
      createdAt: '2026-08-18T19:00:00Z',
      isAnonymous: false,
    },
    {
      id: 'pld-02',
      referenceId: 'REF-PLAT-842',
      amount: 500,
      donorName: 'د. ياسمين عثمان',
      paymentMethod: 'vodafone_cash',
      createdAt: '2026-08-17T11:45:00Z',
      isAnonymous: false,
    },
    {
      id: 'pld-03',
      referenceId: 'REF-PLAT-771',
      amount: 250,
      donorName: 'فاعل خير',
      paymentMethod: 'instapay',
      createdAt: '2026-08-16T17:10:00Z',
      isAnonymous: true,
    },
    {
      id: 'pld-04',
      referenceId: 'REF-PLAT-650',
      amount: 100,
      donorName: 'مهندس حسام الدين',
      paymentMethod: 'instapay',
      createdAt: '2026-08-15T13:20:00Z',
      isAnonymous: false,
    },
  ],
  transparencyAudit: {
    lastAuditedDate: '2026-06-30',
    auditingFirmAr: 'مكتب المتحدون للمحاسبة والمراجعة القانونية',
    auditingFirmEn: 'United Public Accountants & Financial Auditors',
    opinionAr: 'القوائم المالية للخدمات والتبرعات مطابقة لمعايير الشفافية ولا توجد أي عمولات مستقطعة من الحالات الإنسانية.',
    opinionEn: 'Financial records for family disbursements comply with international humanitarian standards; 0% administrative fees deducted from beneficiaries.',
    complianceScore: '100%',
  }
};
