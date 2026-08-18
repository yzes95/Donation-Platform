import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Heart, Lock, Mail, User, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const { t, i18n } = useTranslation('common');
  const { login } = useAuth();
  const navigate = useNavigate();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [email, setEmail] = useState('rep.ahmad@ataa.platform');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, role: 'family_rep' });
      navigate('/dashboard');
    } catch (err) {
      // error handled in auth context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-700 text-white shadow-md mx-auto">
            <Heart className="w-6 h-6 fill-white" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
            تسجيل دخول ممثل الأسرة
          </h1>
          <p className="text-xs text-stone-500">
            أهلاً بك في البوابة الإلكترونية لمتابعة التبرعات وتقديم طلبات المساعدة
          </p>
        </div>

        {/* Demo Helper Card */}
        <div className="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/60 text-xs text-primary-900 dark:text-primary-200 space-y-1">
          <span className="font-bold block">💡 بيانات تجريبية جاهزة للاختبار:</span>
          <div className="text-[11px] text-stone-600 dark:text-stone-300 font-mono">
            البريد: rep.ahmad@ataa.platform | كلمة المرور: password123
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 space-y-5 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rep.ahmad@ataa.platform"
              icon={Mail}
              required
            />

            <Input
              type="password"
              label="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-500">
                <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                <span>تذكرني</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('يرجى التواصل مع المشرف لإعادة التعيين'); }} className="text-primary-700 dark:text-primary-400 font-bold hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full text-sm font-bold shadow-md rounded-2xl"
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center text-xs text-stone-500">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="font-bold text-primary-700 dark:text-primary-400 hover:underline">
              طلب تسجيل ممثل أسرة جديد
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
