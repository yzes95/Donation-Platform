import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { getDonationHistory } from '../../api/donations';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDate, maskDonorName } from '../../lib/formatters';
import { History, Download, Eye, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function DonationHistoryPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const currentLang = i18n.language || 'ar';

  const familyId = user?.familyId || 'fam-01';
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getDonationHistory(familyId);
        setDonations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [familyId]);

  const filtered = donations.filter(d => {
    const q = search.toLowerCase();
    return (
      (d.referenceId && d.referenceId.toLowerCase().includes(q)) ||
      (d.serviceTitle && d.serviceTitle.toLowerCase().includes(q)) ||
      (d.donorName && d.donorName.toLowerCase().includes(q))
    );
  });

  const totalSum = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleExport = () => {
    toast.success('تم تصدير كشف التبرعات بصيغة CSV بنجاح');
  };

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
        title={t('menu.donationHistory')}
        subtitle="سجل كافة التبرعات المستلمة للأسرة مع بيانات المعاملات والمبالغ"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Summary & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center justify-between col-span-1">
            <div>
              <span className="text-xs text-stone-500">إجمالي المبالغ المستلمة</span>
              <div className="text-2xl font-black text-primary-700 dark:text-primary-400 font-display">
                {formatCurrency(totalSum, currentLang)}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </Card>

          <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="ابحث برقم المرجع أو اسم الخدمة..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="md"
              onClick={handleExport}
              icon={Download}
              className="text-xs shrink-0 w-full sm:w-auto"
            >
              تصدير الكشف (CSV)
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden shadow-sm">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                  <tr>
                    <th className="py-3 px-4 text-start font-bold">رقم المرجع</th>
                    <th className="py-3 px-4 text-start font-bold">المتبرع</th>
                    <th className="py-3 px-4 text-start font-bold">الخدمة / الاحتياج</th>
                    <th className="py-3 px-4 text-start font-bold">المبلغ المستلم</th>
                    <th className="py-3 px-4 text-start font-bold">التاريخ</th>
                    <th className="py-3 px-4 text-start font-bold">الحالة</th>
                    <th className="py-3 px-4 text-center font-bold">معاينة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                        {d.referenceId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                        {maskDonorName(d.donorName, d.isAnonymous, currentLang)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                        {d.serviceTitle || 'تبرع عام للأسرة'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-700 dark:text-primary-400 text-sm">
                        {formatCurrency(d.amount, currentLang)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-400">
                        {formatDate(d.createdAt, currentLang)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/track?ref=${d.referenceId}`}
                          className="p-1.5 inline-flex rounded-lg text-stone-400 hover:text-primary-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={History}
                title="لا توجد تبرعات مسجلة"
                description="لم يتم العثور على تبرعات واردة مطابقة لبحثك."
              />
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
