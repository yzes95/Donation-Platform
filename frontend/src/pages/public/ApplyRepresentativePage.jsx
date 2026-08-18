import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockRegisteredFamilyGroups } from '../../data/families';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Users,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export function ApplyRepresentativePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [applicantName, setApplicantName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [familyGroupId, setFamilyGroupId] = useState('tarabin_aboshwemy');
  const [customFamilyName, setCustomFamilyName] = useState('');
  const [governorate, setGovernorate] = useState('شمال سيناء');
  const [cityVillage, setCityVillage] = useState('');
  const [membersCount, setMembersCount] = useState('5');
  const [caseDescription, setCaseDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName || !nationalId || !phone || !email) {
      toast.error(isArabic ? 'يرجى ملء جميع البيانات الأساسية' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(
      isArabic
        ? 'تم تقديم طلب الاعتماد بنجاح! سيقوم مسؤول النظام والباحث الميداني بالتواصل معك.'
        : 'Application submitted successfully! Our social researcher will contact you.'
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <Users className="w-4 h-4 text-teal-600" />
          <span>{isArabic ? 'بوابة طلبات الاعتماد الميداني للأسر والقبائل' : 'Field Representative Accreditation Application'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {isArabic ? 'طلب تسجيل واعتماد ممثل أسرة أو قبيلة' : 'Apply to Become a Verified Family Representative'}
        </h1>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {isArabic
            ? 'تتيح منصة عطاء لممثلي الأسر والقبائل (مثل عائلات قبيلة الترابين، البياضية، وغيرها) تقديم طلب رسمي لتسجيل الحالات وعرض الاحتياجات الطبية والسكنية للمتبرعين بعد التحقق الميداني والاعتماد الإداري.'
            : 'Apply on behalf of a vulnerable family or tribe branch (e.g. Tarabin families, Bayadiya, etc.) to publish verified needs and receive direct community assistance.'}
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-xl border-t-8 border-t-emerald-600">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
              {isArabic ? 'تم استلام طلب الاعتماد بنجاح' : 'Application Received Successfully'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              {isArabic
                ? 'تم إدراج طلبك في طابور التحقق الميداني للإدارة المركزية (كود الطلب: REP-APP-2026). سيتواصل معك باحث اجتماعي معتمد لتحديد موعد الزيارة الميدانية وتفعيل حسابك كممثل معتمد.'
                : 'Your application has been logged to the Admin Verification Queue. An assigned social researcher will contact you for field verification.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 text-start space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'مراحل خطة المراجعة والاعتماد:' : 'Review & Verification Steps:'}</span>
            </div>
            <ol className="list-decimal ps-5 space-y-1 text-stone-500">
              <li>{isArabic ? 'مراجعة الأوراق الثبوتية والبطاقة القومية من قبل المشرف الإداري.' : 'Review of national ID and identity documents.'}</li>
              <li>{isArabic ? 'الزيارة الميدانية للباحث الاجتماعي لمعاينة السكن والظروف المعيشية.' : 'Field home visit by verified social researcher.'}</li>
              <li>{isArabic ? 'تفعيل بوابتك الخاصة لإضافة الاحتياجات وسحب المبالغ المجمعة.' : 'Portal activation to post needs and manage incoming donations.'}</li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary text-xs px-6 py-2.5">
              {isArabic ? 'العودة للصفحة الرئيسية' : 'Return Home'}
            </Link>
            <Link to="/login" className="btn-secondary text-xs px-6 py-2.5">
              {isArabic ? 'تسجيل الدخول إذا كان لديك حساب سابق' : 'Login to Existing Account'}
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-10 space-y-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Representative Identity */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                <span>{isArabic ? '1. بيانات ممثل الأسرة أو المسؤول المعتمد' : '1. Representative Personal Information'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={isArabic ? 'الاسم الرباعي الرسمي لمقدم الطلب' : 'Full Official Name'}
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder={isArabic ? 'مثال: أحمد عمار أبو شويعي' : 'e.g. Ahmad Ammar Aboshwemy'}
                  required
                />
                <Input
                  label={isArabic ? 'الرقم القومي (14 رقم)' : 'National ID (14 Digits)'}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="29001010101234"
                  maxLength={14}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label={isArabic ? 'رقم الهاتف الأساسي / واتساب' : 'Primary Phone / WhatsApp'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  icon={Phone}
                  required
                />
                <Input
                  type="email"
                  label={isArabic ? 'البريد الإلكتروني للإشعارات' : 'Email Address'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  icon={Mail}
                  required
                />
              </div>
            </div>

            {/* Step 2: Family & Tribe Affiliation */}
            <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-warm-600" />
                <span>{isArabic ? '2. الانتماء العائلي والقبلي ونطاق الحالة' : '2. Family / Tribe Affiliation'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isArabic ? 'اختر العائلة أو القبيلة المسجلة:' : 'Select Registered Family/Tribe Group:'}
                  </label>
                  <select
                    value={familyGroupId}
                    onChange={(e) => setFamilyGroupId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2.5 text-stone-800 dark:text-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {mockRegisteredFamilyGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {isArabic ? `${grp.nameAr} (${grp.regionAr})` : `${grp.nameEn} (${grp.regionEn})`}
                      </option>
                    ))}
                    <option value="other_custom">{isArabic ? '⭐ عائلة أخرى / إضافة فرع جديد' : '⭐ Other / Register New Family Branch'}</option>
                  </select>
                </div>

                {familyGroupId === 'other_custom' && (
                  <Input
                    label={isArabic ? 'اسم العائلة أو الفرع الجديد' : 'New Family / Tribe Name'}
                    value={customFamilyName}
                    onChange={(e) => setCustomFamilyName(e.target.value)}
                    placeholder={isArabic ? 'مثال: عائلة الجدايدة' : 'e.g. Al-Jadaida Family'}
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label={isArabic ? 'المحافظة' : 'Governorate'}
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  options={[
                    { value: 'شمال سيناء', label: isArabic ? 'شمال سيناء' : 'North Sinai' },
                    { value: 'جنوب سيناء', label: isArabic ? 'جنوب سيناء' : 'South Sinai' },
                    { value: 'الإسماعيلية', label: isArabic ? 'الإسماعيلية' : 'Ismailia' },
                    { value: 'السويس', label: isArabic ? 'السويس' : 'Suez' },
                    { value: 'الشرقية', label: isArabic ? 'الشرقية' : 'Sharqia' },
                    { value: 'القاهرة', label: isArabic ? 'القاهرة' : 'Cairo' },
                    { value: 'الجيزة', label: isArabic ? 'الجيزة' : 'Giza' },
                    { value: 'الفيوم', label: isArabic ? 'الفيوم' : 'Fayoum' },
                    { value: 'أسيوط', label: isArabic ? 'أسيوط' : 'Asyut' },
                  ]}
                />

                <Input
                  label={isArabic ? 'المدينة / القرية / المركز' : 'City / Village / District'}
                  value={cityVillage}
                  onChange={(e) => setCityVillage(e.target.value)}
                  placeholder={isArabic ? 'مثال: القنطرة شرق، قرية جلبانة' : 'e.g. Qantara East'}
                  required
                />

                <Input
                  type="number"
                  label={isArabic ? 'عدد أفراد الأسرة المستهدفة' : 'Family Members Count'}
                  value={membersCount}
                  onChange={(e) => setMembersCount(e.target.value)}
                  min="1"
                  max="30"
                  required
                />
              </div>
            </div>

            {/* Step 3: Needs & Background */}
            <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{isArabic ? '3. شرح الاحتياجات والظروف المعيشية' : '3. Needs & Family Circumstances'}</span>
              </h3>

              <Textarea
                label={isArabic ? 'شرح تفصيلي لاحتياجات الأسرة (علاج، ترميم سكن، صيانة مدافن، أيتام، ديون)' : 'Detailed description of family needs (medical, housing, graveyard maintenance, orphans)'}
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder={isArabic ? 'اشرح طبيعة الحالة والاحتياجات العاجلة بدقة لتسهيل فحص الباحث الميداني...' : 'Describe the family situation and immediate needs...'}
                rows={4}
                required
              />

              {/* Upload proof */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
                  {isArabic ? 'إرفاق المستندات المبدئية (صورة البطاقة، تقارير طبية، فواتير إيجار)' : 'Attach Verification Documents (National ID, Medical Reports)'}
                </label>
                <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-6 text-center space-y-2 hover:border-primary-500 transition-colors cursor-pointer bg-stone-50/50 dark:bg-stone-800/40">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                    {isArabic ? 'اسحب وأفلت المستندات أو اضغط للتصفح من جهازك' : 'Drag & drop supporting files or click to browse'}
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    PNG, JPG, PDF (بحد أقصى 10 ميجابايت)
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy and Verification Agreement */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isArabic ? 'إقرار وموافقة على التحقق الميداني والنزاهة:' : 'Verification & Integrity Pledge:'}</span>
              </div>
              <p className="leading-relaxed text-[11px] opacity-90">
                {isArabic
                  ? 'أقر بصفتي ممثلاً للحالة بصحة كافة المعلومات وأوافق على استقبال الباحث الاجتماعي الميداني المعتمد من منصة عطاء وتوفير كافة المستندات الأصلية عند الطلب.'
                  : 'I certify that all provided information is accurate and agree to receive the certified social researcher for on-site field verification.'}
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={Sparkles}
              className="w-full text-base font-bold shadow-lg rounded-2xl py-4"
            >
              {isArabic ? 'إرسال طلب الاعتماد للمراجعة الميدانية' : 'Submit Application for Field Verification'}
            </Button>

          </form>
        </Card>
      )}

    </div>
  );
}
