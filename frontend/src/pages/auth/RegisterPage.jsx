import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Heart, User, Mail, Phone, MapPin, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterPage() {
  const { registerFamily } = useAuth();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [governorate, setGovernorate] = useState('شمال سيناء');
  const [membersCount, setMembersCount] = useState('4');
  const [briefNeed, setBriefNeed] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !nationalId) {
      toast.error(isArabic ? 'يرجى ملء كافة البيانات الأساسية' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await registerFamily({
        name,
        email,
        phone,
        nationalId,
        governorate,
        membersCount: Number(membersCount),
        briefNeed,
      });
      toast.success(isArabic ? 'تم إرسال طلبك بنجاح وسيتواصل معك الباحث الاجتماعي' : 'Application registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-700 text-white shadow-md mx-auto">
          <Heart className="w-6 h-6 fill-white" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
          {isArabic ? 'طلب تسجيل ومساعدة أسرة متعففة' : 'Register Family Assistance Request'}
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          {isArabic
            ? 'يتم التعامل مع جميع البيانات بسرية وأمان تام؛ ويقوم باحث اجتماعي معتمد بمراجعة المستندات والتحقق الميداني قبل النشر.'
            : 'All records are protected under strict humanitarian confidentiality and verified on-site by certified researchers.'}
        </p>

        <div className="pt-2">
          <Link
            to="/apply-rep"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-4 py-2 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{isArabic ? 'هل تمثل قبيلة أو عائلة (الترابين، البياضية) وترغب في اعتماد شامل؟ اضغط هنا' : 'Representing a tribe or registered family? Apply here'}</span>
          </Link>
        </div>
      </div>

      <Card className="p-6 sm:p-10 space-y-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              {isArabic ? '1. بيانات ممثل الأسرة ومقدم الطلب' : '1. Applicant & Representative Info'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isArabic ? 'الاسم الرباعي لممثل الأسرة' : 'Full Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isArabic ? 'الاسم الرباعي الرسمي' : 'Full legal name'}
                icon={User}
                required
              />
              <Input
                type="email"
                label={isArabic ? 'البريد الإلكتروني للتواصل' : 'Email Address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="tel"
                label={isArabic ? 'رقم الهاتف الأساسي' : 'Phone Number'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                icon={Phone}
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
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              {isArabic ? '2. بيانات الحالة والاحتياج الأولي' : '2. Household Information & Primary Need'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={isArabic ? 'المحافظة' : 'Governorate'}
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                options={[
                  { value: 'شمال سيناء', label: isArabic ? 'شمال سيناء' : 'North Sinai' },
                  { value: 'جنوب سيناء', label: isArabic ? 'جنوب سيناء' : 'South Sinai' },
                  { value: 'الإسماعيلية', label: isArabic ? 'الإسماعيلية' : 'Ismailia' },
                  { value: 'القاهرة', label: isArabic ? 'القاهرة' : 'Cairo' },
                  { value: 'الجيزة', label: isArabic ? 'الجيزة' : 'Giza' },
                  { value: 'الفيوم', label: isArabic ? 'الفيوم' : 'Fayoum' },
                  { value: 'المنوفية', label: isArabic ? 'المنوفية' : 'Menoufia' },
                  { value: 'أسيوط', label: isArabic ? 'أسيوط' : 'Asyut' },
                ]}
              />
              <Input
                type="number"
                label={isArabic ? 'عدد أفراد الأسرة' : 'Family Members Count'}
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
                min="1"
                max="20"
                required
              />
            </div>

            <Textarea
              label={isArabic ? 'شرح موجز لظروف الأسرة والاحتياج العاجل' : 'Brief Case Summary & Primary Need'}
              value={briefNeed}
              onChange={(e) => setBriefNeed(e.target.value)}
              placeholder={isArabic ? 'اذكر نوع الاحتياج (علاج، إيجار، صيانة مدافن، ديون، أيتام)...' : 'Describe the situation and urgent assistance needed...'}
              rows={3}
            />
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs text-stone-500 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'إقرار التحقق والموافقة' : 'Verification & Integrity Agreement'}</span>
            </div>
            <p className="leading-relaxed">
              {isArabic
                ? 'أقر بأن جميع البيانات المدخلة صحيحة وأوافق على استقبال الباحث الميداني المعتمد من منصة عطاء لمعاينة الحالة وتقديم التقارير اللازمة.'
                : 'I certify that all details provided are accurate and agree to cooperate with on-site certified field researchers.'}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full text-sm font-bold shadow-md rounded-2xl"
          >
            {isArabic ? 'إرسال طلب التسجيل' : 'Submit Registration'}
          </Button>

          <div className="text-center text-xs text-stone-500 pt-2">
            {isArabic ? 'لديك حساب مسجل بالفعل؟ ' : 'Already registered? '}
            <Link to="/login" className="font-bold text-primary-700 dark:text-primary-400 hover:underline">
              {isArabic ? 'تسجيل الدخول لبوابتك' : 'Login to your portal'}
            </Link>
          </div>
        </form>
      </Card>

    </div>
  );
}
