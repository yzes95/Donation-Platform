import React, { useState } from 'react';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Send, Bell, Radio, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsManagementPage() {
  const [targetAudience, setTargetAudience] = useState('all_families');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('app_and_sms');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('يرجى كتابة عنوان ونص الإشعار');
      return;
    }

    setIsSending(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSending(false);
    toast.success('تم بث الإشعار بنجاح لكافة المستخدمين المحددين');
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="إدارة وبث الإشعارات والتنبيهات العامة"
        subtitle="إرسال تنبيهات فورية عبر الرسائل القصيرة (SMS) والتطبيق للأسر والمتبرعين"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Card className="p-6 sm:p-10 space-y-6 shadow-md">
          <form onSubmit={handleBroadcast} className="space-y-5">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              <Radio className="w-5 h-5 text-primary-600" />
              <span>إنشاء بث تنبيهي جديد</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="الفئة المستهدفة"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                options={[
                  { value: 'all_families', label: 'كافة ممثلي الأسر المسجلين' },
                  { value: 'field_researchers', label: 'فريق الباحثين الميدانيين' },
                  { value: 'donors', label: 'المتبرعين المشتركين في النشرة' },
                  { value: 'all_users', label: 'كافة مستخدمي المنصة' },
                ]}
              />

              <Select
                label="قنوات الإرسال"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                options={[
                  { value: 'app_and_sms', label: 'إشعار فوري + رسالة نصية قصيرة SMS' },
                  { value: 'app_only', label: 'إشعار داخل التطبيق فقط' },
                  { value: 'sms_only', label: 'رسالة نصية قصيرة SMS فقط' },
                  { value: 'email', label: 'بريد إلكتروني رسمي' },
                ]}
              />
            </div>

            <Input
              label="عنوان التنبيه"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تحديث مواعيد زيارات الباحثين الميدانيين لشهر رمضان"
              required
            />

            <Textarea
              label="نص الرسالة والإشعار"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب نص الإشعار بالتفصيل..."
              rows={4}
              required
            />

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
              ⚠️ تنبيه: سيتم إرسال الرسائل عبر خوادم AWS SNS ومزود الرسائل المحلي بشكل لحظي.
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSending}
                icon={Send}
                className="px-8"
              >
                بث التنبيه الآن
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
