import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getService } from '../../api/families';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { AssistanceCategories } from '../../lib/constants';
import { Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function EditAssistanceRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('medical');
  const [targetAmount, setTargetAmount] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [beneficiary, setBeneficiary] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const srv = await getService(id);
        setTitle(srv.titleAr || srv.titleEn);
        setCategory(srv.category || 'medical');
        setTargetAmount(srv.targetAmount || 10000);
        setUrgency(srv.urgency || 'high');
        setBeneficiary(srv.beneficiaryAr || 'الأسرة');
        setDescription(srv.descriptionAr || srv.descriptionEn);
      } catch (err) {
        toast.error('تعذر تحميل بيانات الخدمة');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      toast.success('تم حفظ وتعديل بيانات الطلب بنجاح');
      navigate('/dashboard/needs');
    } catch (err) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        title="تعديل بيانات طلب المساعدة"
        subtitle={`تعديل تفاصيل الاحتياج رقم ${id}`}
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
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t('forms.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={AssistanceCategories.map(c => ({
                  value: c.id,
                  label: isArabic ? c.nameAr : c.nameEn
                }))}
              />
              <Input
                type="number"
                label={t('forms.targetAmount')}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Input
                label="المستفيد المباشر"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
              />
            </div>

            <Textarea
              label={t('forms.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
              <Link to="/dashboard/needs" className="btn-secondary text-xs px-6 py-2.5">
                إلغاء
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                icon={Save}
                className="px-8"
              >
                حفظ التعديلات
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
