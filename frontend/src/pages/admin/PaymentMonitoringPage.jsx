import React, { useState, useEffect } from 'react';
import { mockPayments } from '../../data/payments';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { CreditCard, Zap, Smartphone, Globe, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentMonitoringPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  const handleReconcile = () => {
    toast.success('تمت المطابقة الآلية بنجاح مع بنك مصر وشبكة المدفوعات اللحظية IPN');
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="مراقبة بوابات الدفع والمعاملات البنكية"
        subtitle="حالة الاتصال مع InstaPay، فودافون كاش، وبطاقات ميزة/فيزا ونسب النجاح"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Gateway Health Statuses */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border-s-4 border-s-emerald-500">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100">شبكة InstaPay مصر</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs text-stone-500">
              زمن الاستجابة: <strong className="text-stone-800 dark:text-stone-200">120ms</strong> • معدل النجاح: <strong className="text-emerald-600">99.8%</strong>
            </div>
          </Card>

          <Card className="p-5 space-y-2 border-s-4 border-s-emerald-500">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100">محافظ الهاتف (Vodafone/Orange)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs text-stone-500">
              زمن الاستجابة: <strong className="text-stone-800 dark:text-stone-200">240ms</strong> • معدل النجاح: <strong className="text-emerald-600">98.5%</strong>
            </div>
          </Card>

          <Card className="p-5 space-y-2 border-s-4 border-s-emerald-500">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100">بطاقات فيزا / ماستركارد / ميزة</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs text-stone-500">
              زمن الاستجابة: <strong className="text-stone-800 dark:text-stone-200">310ms</strong> • معدل النجاح: <strong className="text-emerald-600">99.1%</strong>
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              سجل تسويات بوابات الدفع اللحظية
            </h3>
            <Button size="sm" variant="outline" onClick={handleReconcile} icon={RefreshCw}>
              مطابقة بنكية فورية (Reconcile)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <tr>
                  <th className="py-3 px-4 text-start font-bold">مرجع العملية</th>
                  <th className="py-3 px-4 text-start font-bold">البوابة / الشبكة</th>
                  <th className="py-3 px-4 text-start font-bold">مرجع البنك (Gateway Ref)</th>
                  <th className="py-3 px-4 text-start font-bold">المبلغ المسدد</th>
                  <th className="py-3 px-4 text-start font-bold">التوقيت</th>
                  <th className="py-3 px-4 text-start font-bold">حالة السداد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {p.referenceId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold uppercase text-stone-800 dark:text-stone-200">
                      {p.gateway}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      {p.gatewayRef}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700 dark:text-primary-400 text-sm">
                      {formatCurrency(p.amount, 'ar')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {formatDateTime(p.createdAt, 'ar')}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
