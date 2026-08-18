import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { createAssistanceRequest } from '../../api/families';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AssistanceCategories } from '../../lib/constants';
import { PlusCircle, Upload, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function CreateAssistanceRequestPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const navigate = useNavigate();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('medical');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [unitLabel, setUnitLabel] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [beneficiary, setBeneficiary] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount || !description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAssistanceRequest({
        familyId: user?.familyId || 'fam-01',
        titleAr: title,
        titleEn: title,
        category: category === 'custom' ? (customCategoryName || 'general') : category,
        unitLabelAr: unitLabel || 'سهم مساهمة',
        unitLabelEn: unitLabel || 'Donation Share',
        targetAmount: Number(targetAmount),
        urgency,
        beneficiaryAr: beneficiary || 'الأسرة / المجتمع',
        beneficiaryEn: beneficiary || 'Family / Community',
        descriptionAr: description,
        descriptionEn: description,
      });

      toast.success('تم إرسال طلب المساعدة للمراجعة الميدانية والاعتماد');
      navigate('/dashboard/needs');
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        title="إضافة بند أو احتياج جديد للأسرة"
        subtitle="يمكنك إضافة أي احتياج (علاج، ترميم منزل، صيانة مدافن، أيتام، أو مبادرة مجتمعية)"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Link
          to="/dashboard/needs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>العودة لإدارة الاحتياجات</span>
        </Link>

        <Card className="p-6 sm:p-10 space-y-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <Input
              label={t('forms.needTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ترميم سقف منزل، صيانة مدافن الأسرة، عملية جراحية، مبادرة إطعام"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t('forms.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  ...AssistanceCategories.map(c => ({
                    value: c.id,
                    label: isArabic ? c.nameAr : c.nameEn
                  })),
                  { value: 'custom', label: '⭐ تصنيف مخصص آخر (صيانة مدافن، مبادرة حي، مشروع)' }
                ]}
              />

              <Input
                type="number"
                label={t('forms.targetAmount')}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="مثال: 15000"
                min="100"
                required
              />
            </div>

            {category === 'custom' && (
              <Input
                label="اسم التصنيف المخصص"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="مثال: صيانة مدافن الأسرة، كفالة مسكن، دعم زواج"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="وصف الوحدة / السهم (اختياري)"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="مثال: سهم ترميم، تكلفة حقنة، سهم صيانة"
              />

              <Select
                label={t('forms.urgency')}
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                options={[
                  { value: 'critical', label: 'حرج للغاية (تدخل فوري)' },
                  { value: 'high', label: 'عالي الأولوية' },
                  { value: 'medium', label: 'متوسط' },
                  { value: 'low', label: 'عادي' },
                ]}
              />
            </div>

            <Input
              label="المستفيد المباشر"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="مثال: أفراد أسرة عمار، أيتام الأسرة، المريض فلان"
            />

            <Textarea
              label={t('forms.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اشرح تفاصيل الاحتياج والمبالغ المطلوبة والمستندات..."
              rows={4}
              required
            />

            {/* Upload docs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-200">
                {t('forms.supportingDocs')}
              </label>
              <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-6 text-center space-y-2 hover:border-primary-500 transition-colors cursor-pointer bg-stone-50/50 dark:bg-stone-800/40">
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                  اسحب وأفلت الفواتير، المقايسات، أو التقارير الطبية
                </span>
                <span className="text-[11px] text-stone-400 block">
                  PNG, JPG, PDF (بحد أقصى 10 ميجابايت)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
              <Link to="/dashboard/needs" className="btn-secondary text-xs px-6 py-2.5">
                إلغاء
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={PlusCircle}
                className="px-8"
              >
                إرسال الطلب للاعتماد
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}
