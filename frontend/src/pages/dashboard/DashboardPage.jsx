import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { getFamilyServices } from '../../api/families';
import { getDonationHistory } from '../../api/donations';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDate, maskDonorName } from '../../lib/formatters';
import {
  DollarSign,
  ListTodo,
  CheckCircle2,
  Clock,
  PlusCircle,
  TrendingUp,
  Heart,
  ArrowRight,
  ArrowLeft,
  Users,
  Eye
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function DashboardPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [needs, setNeeds] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const familyId = user?.familyId || 'fam-01';

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, donData] = await Promise.all([
          getFamilyServices(familyId),
          getDonationHistory(familyId)
        ]);
        setNeeds(servicesData);
        setDonations(donData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [familyId]);

  const totalReceived = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeNeedsCount = needs.filter(n => n.status === 'active').length;
  const completedNeedsCount = needs.filter(n => n.status === 'funded' || n.status === 'completed').length;
  const pendingCount = needs.filter(n => n.status === 'pending_review').length;

  const chartData = [
    { name: 'مايو', amount: 8000 },
    { name: 'يونيو', amount: 12500 },
    { name: 'يوليو', amount: 19000 },
    { name: 'أغسطس', amount: 33500 },
  ];

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
        title={t('welcome', { name: user?.name || 'أم أحمد' })}
        subtitle={t('overview')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. TOP METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={t('metrics.totalReceived')}
            value={formatCurrency(totalReceived, currentLang)}
            icon={DollarSign}
            trend="+24% هذا الشهر"
            iconBg="bg-primary-50 dark:bg-primary-950/60"
            iconColor="text-primary-700 dark:text-primary-400"
          />
          <StatsCard
            title={t('metrics.activeNeeds')}
            value={activeNeedsCount}
            icon={ListTodo}
            subtitle="احتياجات جارية للتبرع"
            iconBg="bg-blue-50 dark:bg-blue-950/60"
            iconColor="text-blue-700 dark:text-blue-400"
          />
          <StatsCard
            title={t('metrics.completedNeeds')}
            value={completedNeedsCount}
            icon={CheckCircle2}
            subtitle="خدمات تم استيفاؤها"
            iconBg="bg-emerald-50 dark:bg-emerald-950/60"
            iconColor="text-emerald-700 dark:text-emerald-400"
          />
          <StatsCard
            title={t('metrics.pendingRequests')}
            value={pendingCount}
            icon={Clock}
            subtitle="بانتظار مراجعة الباحث"
            iconBg="bg-amber-50 dark:bg-amber-950/60"
            iconColor="text-amber-700 dark:text-amber-400"
          />
        </div>

        {/* 2. CHART + QUICK ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 2 Cols */}
          <div className="lg:col-span-2 card-base p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                نمو التبرعات المستلمة للأسرة
              </h3>
              <span className="text-xs text-stone-400">آخر 4 أشهر</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#0F766E" fillOpacity={1} fill="url(#colorDon)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions 1 Col */}
          <div className="card-base p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                إجراءات سريعة
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                يمكنك تقديم طلب مساعدة علاجية أو سكنية جديدة للمراجعة الميدانية.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link to="/dashboard/needs/create" className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>طلب مساعدة / احتياج جديد</span>
              </Link>
              <Link to="/dashboard/profile" className="btn-secondary w-full py-2.5 text-xs text-center block">
                تحديث بيانات ملف الأسرة
              </Link>
              <Link to={`/families/${familyId}`} target="_blank" className="btn-outline w-full py-2.5 text-xs text-center block">
                معاينة الملف كما يراه المتبرع ↗
              </Link>
            </div>
          </div>

        </div>

        {/* 3. ACTIVE NEEDS LIST */}
        <div className="card-base p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('needsTable.title')}
            </h3>
            <Link to="/dashboard/needs" className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline">
              عرض كافة الاحتياجات ({needs.length})
            </Link>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {needs.slice(0, 4).map((need) => (
              <div key={need.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-400">{need.code}</span>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                      {isArabic ? need.titleAr : need.titleEn}
                    </h4>
                  </div>
                  <span className="text-stone-500">
                    المستفيد: <strong>{isArabic ? need.beneficiaryAr : need.beneficiaryEn}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>{Math.round((need.raisedAmount / need.targetAmount) * 100)}%</span>
                      <span className="font-bold">{formatCurrency(need.raisedAmount, currentLang)}</span>
                    </div>
                    <ProgressBar value={need.raisedAmount} max={need.targetAmount} size="sm" variant="primary" />
                  </div>
                  <StatusBadge status={need.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RECENT DONATIONS TABLE */}
        <div className="card-base p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('recentDonations.title')}
            </h3>
            <Link to="/dashboard/donations" className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline">
              {t('recentDonations.viewAll')}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="border-b border-stone-200 dark:border-stone-700 text-stone-400">
                <tr>
                  <th className="py-2.5 px-3 text-start">{t('recentDonations.donor')}</th>
                  <th className="py-2.5 px-3 text-start">{t('recentDonations.service')}</th>
                  <th className="py-2.5 px-3 text-start">{t('recentDonations.amount')}</th>
                  <th className="py-2.5 px-3 text-start">{t('recentDonations.date')}</th>
                  <th className="py-2.5 px-3 text-start">{t('recentDonations.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {donations.slice(0, 5).map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 px-3 font-bold text-stone-800 dark:text-stone-200">
                      {maskDonorName(d.donorName, d.isAnonymous, currentLang)}
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                      {d.serviceTitle || 'تبرع عام للأسرة'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary-700 dark:text-primary-400">
                      {formatCurrency(d.amount, currentLang)}
                    </td>
                    <td className="py-3 px-3 text-stone-400 font-mono">
                      {formatDate(d.createdAt, currentLang)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
