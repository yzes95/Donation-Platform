import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, Globe, Moon, Bell, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function AccountSettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('يرجى ملء حقول كلمة المرور');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
    toast.success('تم تحديث كلمة المرور بنجاح');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    toast.success(`تم تغيير اللغة إلى ${lang === 'ar' ? 'العربية' : 'English'}`);
  };

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader
        title="إعدادات الحساب والأمان"
        subtitle="تفضيلات اللغة والمظهر وإعدادات الأمان والتنبيهات"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Language & Theme Settings */}
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-600" />
            <span>تفضيلات العرض واللغة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Language */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                لغة واجهة المنصة
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ar')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    (i18n.language || 'ar').startsWith('ar')
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  العربية (RTL)
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    (i18n.language || '').startsWith('en')
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  English (LTR)
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                مظهر التطبيق (Light / Dark Mode)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'system'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      theme === mode
                        ? 'bg-primary-700 text-white border-primary-700'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {mode === 'light' ? 'فاتح' : mode === 'dark' ? 'داكن' : 'تلقائي'}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Card>

        {/* 2. Notification Preferences */}
        <Card className="p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            <span>تفضيلات الإشعارات والتنبيهات</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  إشعارات الرسائل القصيرة (SMS)
                </span>
                <span className="text-[11px] text-stone-400 block">
                  تلقي رسالة نصية فورية عند استلام تبرع جديد لحالة الأسرة
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  إشعارات البريد الإلكتروني
                </span>
                <span className="text-[11px] text-stone-400 block">
                  تلقي تقارير إيداع التبرعات واعتمادات الباحث الاجتماعي
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* 3. Password / Security */}
        <Card className="p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            <span>تغيير كلمة المرور</span>
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              label="كلمة المرور الحالية"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="password"
                label="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Input
                type="password"
                label="تأكيد كلمة المرور الجديدة"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} icon={Save}>
                تحديث كلمة المرور
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}
