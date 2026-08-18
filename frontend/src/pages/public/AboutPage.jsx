import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ShieldCheck, Users, Lock, Award, Sparkles, CheckCircle2, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FuturisticHeart, FuturisticShield, FuturisticCloud } from '../../components/common/InteractiveIcon';

export function AboutPage() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200 dark:border-primary-800">
          <FuturisticHeart className="w-6 h-6 p-1 border-none shadow-none" />
          <span>{isArabic ? 'رسالتنا وقيمنا الإنسانية' : 'Our Mission & Values'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 font-display">
          {isArabic ? 'عن منصة عطاء' : 'About Ataa Platform'}
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {isArabic
            ? 'منصة رقمية مستقلة تهدف لسد الفجوة بين المتبرعين وأهل الخير وبين الأسر المتعففة في كافة ربوع مصر، وفق أعلى معايير الشفافية والأمان وحفظ الكرامة.'
            : 'An independent digital fintech and social-impact platform bridging generous supporters and verified vulnerable families across Egypt with uncompromising transparency, dignity, and security.'}
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-8 space-y-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 rounded-2xl w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {isArabic ? 'رؤيتنا' : 'Our Vision'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {isArabic
              ? 'أن نكون المنصة الأكثر ثقة وشفافية في العالم العربي للتمكين المالي المباشر للأسر، حيث يصل 100% من كل تبرع إلى مستحقه الحقيقي دون أي عمولات أو وسائط تقليدية.'
              : 'To be the most transparent and trusted platform in the MENA region for direct family financial empowerment, where 100% of donations reach vetted beneficiaries with zero commissions.'}
          </p>
        </div>

        <div className="card-base p-8 space-y-3">
          <div className="p-3 bg-warm-100 dark:bg-warm-950/60 text-warm-700 dark:text-warm-400 rounded-2xl w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {isArabic ? 'رسالتنا' : 'Our Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {isArabic
              ? 'تسخير أحدث التقنيات السحابية والأدوات الميدانية لربط المجتمع الإنساني بالاحتياجات الحقيقية للأسر (علاج، سكن، تعليم، فك كرب) بدقة وكرامة تامة.'
              : 'Harnessing state-of-the-art cloud architecture and field verification tools to connect caring donors directly to verified family needs (medical, housing, education, debt relief) with dignified care.'}
          </p>
        </div>
      </div>

      {/* Field Research Methodology */}
      <div className="card-base p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          {isArabic ? 'فلسفة التحقق الميداني والنزاهة' : 'Field Research & Integrity Methodology'}
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            {isArabic
              ? 'تتبع منصة عطاء بروتوكولاً صارماً للتحقق يتألف من 4 مراحل متتابعة:'
              : 'Ataa follows a rigorous four-stage verification protocol:'}
          </p>
          <ul className="space-y-2.5 ps-4 list-disc text-stone-700 dark:text-stone-200">
            <li>
              <strong>{isArabic ? 'المطابقة الرقمية للبيانات: ' : 'Digital Record Matching: '}</strong>
              {isArabic ? 'فحص الأرقام القومية ومستندات الدخل والحيازة.' : 'Verifying national IDs, income declarations, and official ownership/lease deeds.'}
            </li>
            <li>
              <strong>{isArabic ? 'الزيارة الميدانية للباحث الاجتماعي: ' : 'On-Site Field Visit: '}</strong>
              {isArabic ? 'معاينة السكن والظروف المعيشية على أرض الواقع.' : 'Inspecting housing conditions, living standards, and immediate needs in person.'}
            </li>
            <li>
              <strong>{isArabic ? 'التدقيق الطبي والقانوني: ' : 'Medical & Legal Audit: '}</strong>
              {isArabic ? 'مراجعة التقارير الطبية من مستشفيات جامعية، ومحاضر القضايا للغارمين.' : 'Reviewing hospital diagnostic reports from university hospitals and court documentation.'}
            </li>
            <li>
              <strong>{isArabic ? 'المتابعة بعد الصرف: ' : 'Post-Disbursement Tracking: '}</strong>
              {isArabic ? 'إرفاق إيصالات السداد الرسمية من المستشفيات والجهات الخدمية في ملف الحالة.' : 'Attaching official hospital invoices and receipt vouchers to each completed case.'}
            </li>
          </ul>
        </div>
      </div>

      {/* Platform Funding Separation Callout */}
      <div className="p-8 rounded-3xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2">
            <FuturisticCloud className="w-6 h-6 p-1 border-none shadow-none" />
            <span>{isArabic ? 'نموذج التمويل المستقل للمنصة' : 'Independent Platform Funding Model'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-primary-800/80 dark:text-primary-300/80 leading-relaxed max-w-xl">
            {isArabic
              ? 'لا نقتطع مليماً واحداً من تبرعات الأسر. نعتمد بشكل كامل على تبرعات دعم المنصة السحابية لتغطية مصاريف خوادم AWS وقواعد البيانات والرسائل.'
              : 'Zero fees are deducted from family gifts. We rely exclusively on separate platform support donations to cover AWS infrastructure, databases, and secure SMS services.'}
          </p>
        </div>
        <Link to="/support-platform" className="btn-primary text-xs px-6 py-3 rounded-xl shrink-0 font-bold">
          {isArabic ? 'تعرف على صندوق دعم المنصة' : 'Explore Platform Fund'}
        </Link>
      </div>

    </div>
  );
}
