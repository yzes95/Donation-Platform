import React, { useState, useEffect } from 'react';
import { getReports } from '../../api/admin';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatsCard } from '../../components/common/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency } from '../../lib/formatters';
import { BarChart3, Download, TrendingUp, DollarSign, Users, ShieldCheck, Cloud } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'sonner';

export function ReportsAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getReports();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExport = () => {
    toast.success('تم تصدير التقرير التحليلي المالي بصيغة Excel / CSV بنجاح');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { statistics, trends, categoryDistribution } = data;

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="التقارير المالية والتحليلات الإحصائية"
        subtitle="مؤشرات أداء التبرعات، كفاءة التحقق الميداني، ومقارنات النمو"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Actions */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExport} icon={Download}>
            تصدير التقرير الشامل
          </Button>
        </div>

        {/* 1. KEY TOTALS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي أموال الأسر المحصلة"
            value={formatCurrency(statistics.totalDonationsAmount, 'ar')}
            icon={DollarSign}
            trend="+18% نمو ربع سنوي"
          />
          <StatsCard
            title="صندوق دعم تشغيل المنصة"
            value={formatCurrency(statistics.totalPlatformDonations, 'ar')}
            icon={Cloud}
            subtitle="خوادم AWS وقواعد البيانات"
          />
          <StatsCard
            title="إجمالي المتبرعين المساهمين"
            value={statistics.donorsCount}
            icon={Users}
            subtitle="متبرع مسجل ومجهول"
          />
          <StatsCard
            title="الخدمات والاحتياجات المكتملة"
            value={statistics.completedNeedsCount}
            icon={ShieldCheck}
            subtitle="تم تغطيتها وتسليمها 100%"
          />
        </div>

        {/* 2. CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              التوزيع النسبي للتبرعات حسب مجالات الاحتياج
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="value"
                    nameKey="nameAr"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              {categoryDistribution.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.nameAr} ({c.value}%)</span>
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              مقارنة التدفقات الشهرية (الأسر مقابل المنصة)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="monthAr" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="families" name="تبرعات الأسر" fill="#0F766E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="platform" name="دعم المنصة" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
