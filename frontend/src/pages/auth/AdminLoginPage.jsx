import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldAlert, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@ataa.platform');
  const [password, setPassword] = useState('adminSecret2026');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password, role: 'admin' });
      navigate('/admin');
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-100 dark:bg-surface-dark">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 dark:bg-primary-950 text-white shadow-xl mx-auto border border-stone-800">
            <ShieldAlert className="w-7 h-7 text-primary-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
            بوابة الإدارة المركزية
          </h1>
          <p className="text-xs text-stone-500">
            نظام التحكم والرقابة المالية وإدارة الأسر والمدفوعات
          </p>
        </div>

        {/* Credentials helper */}
        <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-200 text-xs space-y-1 border border-stone-800 shadow-md">
          <span className="font-bold text-warm-400 block">🔑 حساب المشرف المعتمد (Admin):</span>
          <div className="font-mono text-[11px] text-stone-300">
            البريد: admin@ataa.platform | كلمة المرور: adminSecret2026
          </div>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="البريد الإداري"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ataa.platform"
              icon={Mail}
              required
            />

            <Input
              type="password"
              label="مفتاح الأمان / كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full text-sm font-bold shadow-md rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              دخول المشرف الآمن
            </Button>
          </form>

          <div className="text-center text-xs text-stone-400 pt-2">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              ← العودة للواجهة العامة للمنصة
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
