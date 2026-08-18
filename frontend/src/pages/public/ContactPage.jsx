import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPage() {
  const { t, i18n } = useTranslation(['common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('donor_inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: isArabic ? 'كيف يتم التأكد من وصول 100% من التبرع للأسرة دون خصم؟' : 'How is 100% of the donation delivered without deductions?',
      a: isArabic
        ? 'تلتزم منصة عطاء بنموذج التمويل المستقل؛ حيث تُغطى كافة مصاريف الخوادم والرسائل والمعاملات عبر التبرعات المخصصة لخدمات المنصة، وتذهب أموال الحالات لحسابات الجهات الخدمية أو المستفيد مباشرة مع توفير إيصال رسمي.'
        : 'Ataa operates an independent operational funding model. All AWS cloud hosting and payment processing costs are funded separately, ensuring 100% of family donations reach direct beneficiaries with official receipts.'
    },
    {
      q: isArabic ? 'هل يمكنني التبرع دون الإفصاح عن اسمي أو بياناتي؟' : 'Can I donate anonymously?',
      a: isArabic
        ? 'نعم بكل تأكيد، تتيح المنصة خيار (فاعل خير / مجهول) بشكل افتراضي، ولا يظهر اسمك في أي سجل عام أو للمستفيد حفاظاً على الاحتساب والخصوصية.'
        : 'Yes, absolutely. The anonymous option is enabled by default, protecting donor privacy across all public lists and reports.'
    },
    {
      q: isArabic ? 'كيف يمكن لأسرة أو قبيلة التسجيل في منصة عطاء؟' : 'How can a family or tribe apply for accreditation?',
      a: isArabic
        ? 'يمكن لممثل الأسرة الضغط على (طلب اعتماد ممثل أسرة) وتقديم بيانات الحالة، ليقوم الباحث الاجتماعي الميداني المعتمد بالاتصال وتحديد موعد للزيارة المنزلية.'
        : 'A family or tribe representative can submit an application via the "Apply as Family Rep" portal, followed by an on-site visit by our certified field researchers.'
    },
    {
      q: isArabic ? 'ما هي طرق الدفع المتاحة على المنصة؟' : 'What payment methods are supported?',
      a: isArabic
        ? 'نوفر الدفع الفوري عبر InstaPay، المحافظ الإلكترونية (فودافون كاش، أورنج، اتصالات، وي باي)، البطاقات البنكية (فيزا، ماستركارد، ميزة)، وباي بال للتبرعات الدولية.'
        : 'We support instant InstaPay transfers, mobile wallets (Vodafone Cash, Orange, Etisalat, WE), debit/credit cards (Visa, MasterCard, Meeza), and PayPal for international donors.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(isArabic ? 'تم إرسال رسالتك بنجاح وسيقوم فريق الدعم بالرد خلال 24 ساعة.' : 'Your message has been sent successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {isArabic ? 'تواصل مع فريق منصة عطاء' : 'Contact Ataa Platform Team'}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {isArabic
            ? 'نحن هنا للإجابة على استفسارات المتبرعين وممثلي الأسر وتقديم الدعم الفني على مدار الساعة'
            : 'We are here to answer donor inquiries, assist family representatives, and provide 24/7 technical support.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 1 Col: Info cards */}
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {isArabic ? 'قنوات التواصل المباشر' : 'Direct Channels'}
            </h3>
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block">{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
                  <span className="font-bold">support@ataa.platform</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block">{isArabic ? 'الهاتف وواتساب' : 'Phone & WhatsApp'}</span>
                  <span className="font-bold" dir="ltr">+20 100 000 2822</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block">{isArabic ? 'المقر الإداري' : 'Location'}</span>
                  <span className="font-bold">{isArabic ? 'القاهرة وشمال سيناء، جمهورية مصر العربية' : 'Cairo & Sinai, Egypt'}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-2 bg-primary-50/60 dark:bg-primary-950/30 border-primary-100 dark:border-primary-900/40">
            <h4 className="font-bold text-xs text-primary-900 dark:text-primary-200">
              {isArabic ? 'حالات الطوارئ الإنسانية' : 'Humanitarian Emergencies'}
            </h4>
            <p className="text-[11px] text-primary-800/80 dark:text-primary-300/80 leading-relaxed">
              {isArabic
                ? 'للحالات الطبية الحرجة التي تستدعي تدخلاً فورياً خلال ساعات، يرجى التواصل عبر الخط الساخن المباشر.'
                : 'For critical medical emergencies requiring immediate same-day intervention, please call our hotline directly.'}
            </p>
          </Card>
        </div>

        {/* Right 2 Cols: Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 space-y-6">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                  {isArabic ? 'تم استلام رسالتك بنجاح' : 'Message Received Successfully'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {isArabic
                    ? 'شكراً لتواصلك معنا، سيتواصل معك أحد مسؤولي خدمة العملاء عبر البريد الإلكتروني أو الهاتف في أقرب وقت.'
                    : 'Thank you for reaching out. Our support team will respond to your inquiry shortly.'}
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  {isArabic ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={isArabic ? 'الاسم الكريم' : 'Your Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isArabic ? 'اسمك' : 'Your Name'}
                    required
                  />
                  <Input
                    type="email"
                    label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    label={isArabic ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                  />
                  <Select
                    label={isArabic ? 'نوع الاستفسار' : 'Inquiry Category'}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: 'donor_inquiry', label: isArabic ? 'استفسار عن تبرع / كود تتبع' : 'Donation / Tracking Inquiry' },
                      { value: 'family_help', label: isArabic ? 'طلب مساعدة أو تسجيل أسرة' : 'Family Assistance Request' },
                      { value: 'tech_support', label: isArabic ? 'دعم فني ومشاكل في الدفع' : 'Payment / Technical Support' },
                      { value: 'partnership', label: isArabic ? 'شراكات ومؤسسات خيرية' : 'Partnerships & NGOs' },
                      { value: 'other', label: isArabic ? 'أخرى' : 'Other' },
                    ]}
                  />
                </div>

                <Textarea
                  label={isArabic ? 'نص الرسالة أو الاستفسار' : 'Message Content'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isArabic ? 'اكتب رسالتك وتفاصيل استفسارك هنا...' : 'Type your message details here...'}
                  rows={4}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  icon={Send}
                  className="w-full sm:w-auto px-8"
                >
                  {isArabic ? 'إرسال الرسالة' : 'Send Message'}
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="space-y-6 pt-8 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {isArabic ? 'الأسئلة الشائعة (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-stone-500">
            {isArabic ? 'إجابات سريعة على أبرز التساؤلات حول المنصة وآلية التبرع' : 'Quick answers to top questions regarding donations and operations'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card-base p-4 cursor-pointer transition-all"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2.5 pt-2.5 border-t border-stone-100 dark:border-stone-800 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
