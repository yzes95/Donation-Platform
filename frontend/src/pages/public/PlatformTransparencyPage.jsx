import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getReports } from '../../api/admin';
import { getPlatformData } from '../../api/platform';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { ShieldCheck, FileCheck, Award, Lock, PieChart, BarChart2, CheckCircle2, Cloud } from 'lucide-react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

export function PlatformTransparencyPage() {
  const { t, i18n } = useTranslation(['platform', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const [reports, setReports] = useState(null);
  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [rep, plat] = await Promise.all([getReports(), getPlatformData()]);
        setReports(rep);
        setPlatformData(plat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { auditStatement } = platformData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isArabic ? 'تقارير الشفافية والامتثال المالي' : 'Financial Transparency & Audit Reports'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('transparency.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
          {t('transparency.subtitle')}
        </p>
      </div>

      {/* 1. Independent Audit Box */}
      <div className="card-base p-6 sm:p-8 space-y-4 border-s-4 border-s-emerald-600">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {t('transparency.auditStatementTitle')}
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {isArabic ? 'المراجع القانوني:' : 'Auditing Firm:'} {auditStatement ? (isArabic ? auditStatement.auditingFirmAr : auditStatement.auditingFirmEn) : 'United Certified Public Accountants'}
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-2 border-t border-stone-100 dark:border-stone-800">
          {t('transparency.auditStatementDesc')}
        </p>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown */}
        <Card className="p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {isArabic ? 'توزيع تبرعات الأسر حسب المجالات الإنسانية' : 'Donations Distribution by Assistance Category'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={reports.categoryDistribution}
                  dataKey="value"
                  nameKey={isArabic ? 'nameAr' : 'nameEn'}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {reports.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-2">
            {reports.categoryDistribution.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{isArabic ? c.nameAr : c.nameEn} ({c.value}%)</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Monthly Donation Volume */}
        <Card className="p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {isArabic ? 'حجم التبرعات الشهري (الأسر vs تشغيل المنصة)' : 'Monthly Volume (Families vs Platform Operations)'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports.trends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey={isArabic ? 'monthAr' : 'monthEn'} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="families" name={isArabic ? 'تبرعات الأسر' : 'Family Donations'} fill="#0F766E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="platform" name={isArabic ? 'دعم المنصة (AWS/DB)' : 'Platform Infrastructure (AWS/DB)'} fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* 3. Platform Operational Spending Table */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
          {isArabic ? 'تقرير بنود تشغيل البنية التحتية السحابية' : 'Cloud Infrastructure Costs & Coverage'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="border-b border-stone-200 dark:border-stone-700 text-stone-500">
              <tr>
                <th className="py-3 px-4 text-start font-bold">{isArabic ? 'بند التشغيل' : 'Cost Item'}</th>
                <th className="py-3 px-4 text-start font-bold">{isArabic ? 'الهدف الشهري' : 'Monthly Target'}</th>
                <th className="py-3 px-4 text-start font-bold">{isArabic ? 'المجموع حتى الآن' : 'Raised to Date'}</th>
                <th className="py-3 px-4 text-start font-bold">{isArabic ? 'نسبة التغطية' : 'Coverage'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {platformData.costs.map((c) => (
                <tr key={c.id}>
                  <td className="py-3.5 px-4 font-bold text-stone-800 dark:text-stone-200">
                    {isArabic ? c.nameAr : c.nameEn}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {formatCurrency(c.monthlyTarget, currentLang)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-primary-700 dark:text-primary-400 font-bold">
                    {formatCurrency(c.currentRaised, currentLang)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-bold">
                      {Math.round((c.currentRaised / c.monthlyTarget) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
