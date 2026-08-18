import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAdminDashboard } from '../../api/admin';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDateTime, maskDonorName } from '../../lib/formatters';
import {
  DollarSign,
  Users,
  ShieldCheck,
  ListFilter,
  CreditCard,
  Cloud,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export function AdminDashboardPage() {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { statistics, pendingVerificationsCount, pendingRequestsCount, recentDonations, recentAuditLogs } = dashboardData;

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="لوحة الإدارة والرقابة المركزية"
        subtitle="متابعة شاملة للتدفقات المالية، طوابير التحقق الميداني، وحالة الخوادم"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. TOP METRICS (Family vs Platform Side-by-Side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={t('metrics.totalFamilyDonations')}
            value={formatCurrency(statistics.totalDonationsAmount, currentLang)}
            icon={DollarSign}
            subtitle="100% تم تسليمها للأسر"
            iconBg="bg-primary-50 dark:bg-primary-950/60"
            iconColor="text-primary-700 dark:text-primary-400"
          />
          <StatsCard
            title={t('metrics.totalPlatformDonations')}
            value={formatCurrency(statistics.totalPlatformDonations, currentLang)}
            icon={Cloud}
            subtitle="لتغطية خوادم AWS والرسائل"
            iconBg="bg-warm-50 dark:bg-warm-950/60"
            iconColor="text-warm-700 dark:text-warm-400"
          />
          <StatsCard
            title={t('metrics.pendingVerifications')}
            value={pendingVerificationsCount}
            icon={ShieldCheck}
            trend="بحاجة لزيارة ميدانية"
            trendType="down"
            iconBg="bg-amber-50 dark:bg-amber-950/60"
            iconColor="text-amber-700 dark:text-amber-400"
          />
          <StatsCard
            title={t('metrics.pendingNeeds')}
            value={pendingRequestsCount}
            icon={ListFilter}
            subtitle="طلبات مساعدة جديدة"
            iconBg="bg-blue-50 dark:bg-blue-950/60"
            iconColor="text-blue-700 dark:text-blue-400"
          />
        </div>

        {/* 2. CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Chart 2 Cols */}
          <div className="lg:col-span-2 card-base p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                مقارنة حجم التبرعات (الأسر vs تشغيل المنصة)
              </h3>
              <span className="text-xs text-stone-400">آخر 8 أشهر</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey={isArabic ? 'monthAr' : 'monthEn'} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="families" name="تبرعات الأسر" fill="#0F766E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="platform" name="دعم المنصة (AWS/DB)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Alert & Review Box 1 Col */}
          <div className="card-base p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                تنبيهات المراجعة الفورية
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                توجد حالات وطلبات مساعدة جديدة تتطلب موافقة المشرف لاعتماد نشرها.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/verifications"
                className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>طابور التحقق الميداني</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px]">
                  {pendingVerificationsCount} معلق
                </span>
              </Link>

              <Link
                to="/admin/needs-review"
                className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold">
                  <ListFilter className="w-4 h-4 text-blue-600" />
                  <span>مراجعة طلبات المساعدة</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  {pendingRequestsCount} معلق
                </span>
              </Link>

              <Link
                to="/admin/payments"
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>بوابات الدفع (InstaPay/Wallets)</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">
                  مستقرة 100%
                </span>
              </Link>
            </div>
          </div>

        </div>

        {/* 3. RECENT TRANSACTIONS + AUDIT STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Donations */}
          <Card className="p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                آخر عمليات التبرع الواردة
              </h3>
              <Link to="/admin/donations" className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline">
                عرض الكل
              </Link>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {recentDonations.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{d.referenceId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.type === 'platform' ? 'bg-warm-100 text-warm-800 dark:bg-warm-950 dark:text-warm-300' : 'bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-300'
                      }`}>
                        {d.type === 'platform' ? 'دعم المنصة' : 'أسرة'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {maskDonorName(d.donorName, d.isAnonymous, currentLang)} • {d.paymentMethod}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="font-bold font-mono text-sm text-primary-700 dark:text-primary-400 block">
                      {formatCurrency(d.totalPaid || d.amount, currentLang)}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Audit Logs */}
          <Card className="p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                سجل نشاط الإدارة والأمان (Audit)
              </h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline">
                عرض السجل الكامل
              </Link>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {log.actionAr}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {formatDateTime(log.timestamp, currentLang)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    {log.detailsAr}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
