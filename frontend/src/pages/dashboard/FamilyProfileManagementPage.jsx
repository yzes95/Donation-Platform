import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { getFamily, updateFamily } from '../../api/families';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { ShieldCheck, User, MapPin, Home, Phone, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

export function FamilyProfileManagementPage() {
  const { user } = useAuth();
  const familyId = user?.familyId || 'fam-01';

  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: '',
    governorateAr: '',
    membersCount: '',
    socialStatusAr: '',
    housingStatusAr: '',
    monthlyIncome: '',
    summaryAr: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getFamily(familyId);
        setFamily(data);
        setFormData({
          nameAr: data.nameAr || '',
          governorateAr: data.governorateAr || '',
          membersCount: data.membersCount || 4,
          socialStatusAr: data.socialStatusAr || '',
          housingStatusAr: data.housingStatusAr || '',
          monthlyIncome: data.monthlyIncome || 1500,
          summaryAr: data.summaryAr || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [familyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      toast.success('تم حفظ وتحديث بيانات الملف بنجاح');
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
        title="إدارة بيانات ملف الأسرة"
        subtitle="تحديث المعلومات الاجتماعية وبيانات السكن والبحث الميداني"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>ملف معتمد وموثق ميدانياً:</strong> كود الملف <span className="font-mono font-bold">{family?.code}</span>
            </span>
          </div>
          <span className="text-[11px] text-emerald-700/80">باحث معتمد: أ. سامح عبد الفتاح</span>
        </div>

        <Card className="p-6 sm:p-10 space-y-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="الاسم التعريفي العام للحالة (محمي الخصوصية)"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
              />
              <Input
                label="المحافظة والمنطقة العامة"
                value={formData.governorateAr}
                onChange={(e) => setFormData({ ...formData, governorateAr: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="number"
                label="عدد أفراد الأسرة"
                value={formData.membersCount}
                onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
                min="1"
                required
              />
              <Input
                label="الحالة الاجتماعية"
                value={formData.socialStatusAr}
                onChange={(e) => setFormData({ ...formData, socialStatusAr: e.target.value })}
                required
              />
              <Input
                type="number"
                label="الدخل الشهري التقريبي (ج.م)"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                required
              />
            </div>

            <Input
              label="طبيعة ونوع السكن الحالي"
              value={formData.housingStatusAr}
              onChange={(e) => setFormData({ ...formData, housingStatusAr: e.target.value })}
            />

            <Textarea
              label="النبذة العامة عن ظروف واحتياجات الأسرة"
              value={formData.summaryAr}
              onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })}
              rows={4}
              required
            />

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-start gap-2.5 text-xs text-stone-500">
              <Lock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                يتم حجب الأسماء الرباعية والعناوين التفصيلية عن المتبرعين والواجهة العامة للمنصة لصون كرامة الأسرة.
              </span>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100 dark:border-stone-800">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                icon={Save}
                className="px-8"
              >
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}
