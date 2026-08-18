import React, { useState } from 'react';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Settings, Cloud, Database, CreditCard, ShieldCheck, Save } from 'lucide-react';
import { toast } from 'sonner';

export function PlatformSettingsPage() {
  const [platformGoal, setPlatformGoal] = useState('20000');
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api/v1');
  const [awsRegion, setAwsRegion] = useState('me-south-1 (Bahrain)');
  const [s3Bucket, setS3Bucket] = useState('ataa-documents-vault-prod');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
    toast.success('تم حفظ إعدادات المنصة والبنية السحابية بنجاح');
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="إعدادات المنصة والبنية التحتية"
        subtitle="تهيئة أهداف التمويل التشغيلي، ربط خوادم FastAPI، وتكاملات AWS"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* 1. Platform Funding Goals */}
          <Card className="p-6 sm:p-8 space-y-4 shadow-sm border-s-4 border-s-warm-500">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-warm-600" />
              <span>الهدف المالي الشهري لدعم تشغيل المنصة</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              تحديد المبلغ الإجمالي المطلوب شهرياً لتغطية خوادم AWS، قواعد البيانات، وتراخيص الدفع.
            </p>

            <Input
              type="number"
              label="الهدف الشهري لصندوق المنصة (ج.م)"
              value={platformGoal}
              onChange={(e) => setPlatformGoal(e.target.value)}
              required
            />
          </Card>

          {/* 2. FastAPI Backend Integration Settings */}
          <Card className="p-6 sm:p-8 space-y-4 shadow-sm border-s-4 border-s-primary-600">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              <span>نقاط اتصال خادم الواجهة البرمجية (FastAPI)</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              إعدادات الربط المباشر مع واجهة REST API الخلفية (FastAPI + PostgreSQL).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رابط الـ API الأساسي (VITE_API_URL)"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                fontMono
                required
              />
              <Input
                label="منطقة AWS السحابية (Region)"
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                required
              />
            </div>

            <Input
              label="مستودع المستندات الآمن (S3 Document Vault)"
              value={s3Bucket}
              onChange={(e) => setS3Bucket(e.target.value)}
              fontMono
              required
            />
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              icon={Save}
              className="px-10 font-bold shadow-md rounded-2xl"
            >
              حفظ وتطبيق الإعدادات
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
