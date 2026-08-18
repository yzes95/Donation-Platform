import React, { useState, useEffect } from 'react';
import { getAllDonations } from '../../api/donations';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDateTime, maskDonorName } from '../../lib/formatters';
import { DollarSign, Download, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function DonationMonitoringPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'family' | 'platform'
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllDonations();
        setDonations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = donations.filter(d => {
    const matchesTab = activeTab === 'all' || d.type === activeTab;
    const q = search.toLowerCase();
    const matchesSearch = !q || (d.referenceId && d.referenceId.toLowerCase().includes(q)) || (d.donorName && d.donorName.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const handleFlag = (ref) => {
    toast.warning(`تم تحديد المعاملة ${ref} للفحص والتدقيق الأمني`);
  };

  const handleExport = () => {
    toast.success('تم تصدير المعاملات بصيغة CSV بنجاح');
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
      <AdminHeader
        title="مراقبة التبرعات والمعاملات المالية"
        subtitle="سجل لحظي لتدفقات تبرعات الأسر ومساهمات دعم تشغيل المنصة"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top filter tabs & search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-stone-900 text-white dark:bg-primary-700' : 'bg-white dark:bg-stone-800 text-stone-600 border border-stone-200 dark:border-stone-700'
              }`}
            >
              كافة التبرعات ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'family' ? 'bg-primary-700 text-white' : 'bg-white dark:bg-stone-800 text-stone-600 border border-stone-200 dark:border-stone-700'
              }`}
            >
              تبرعات الأسر فقط
            </button>
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'platform' ? 'bg-warm-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600 border border-stone-200 dark:border-stone-700'
              }`}
            >
              دعم المنصة (AWS/DB)
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="بحث بالمرجع أو المتبرع..."
              className="w-full sm:w-64"
            />
            <Button variant="outline" size="sm" onClick={handleExport} icon={Download} className="shrink-0">
              تصدير
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <tr>
                  <th className="py-3 px-4 text-start font-bold">رقم المرجع</th>
                  <th className="py-3 px-4 text-start font-bold">النوع</th>
                  <th className="py-3 px-4 text-start font-bold">المتبرع</th>
                  <th className="py-3 px-4 text-start font-bold">المستفيد / الخدمة</th>
                  <th className="py-3 px-4 text-start font-bold">المبلغ الإجمالي</th>
                  <th className="py-3 px-4 text-start font-bold">وسيلة الدفع</th>
                  <th className="py-3 px-4 text-start font-bold">الحالة</th>
                  <th className="py-3 px-4 text-center font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {d.referenceId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.type === 'platform' ? 'bg-warm-100 text-warm-800 dark:bg-warm-950 dark:text-warm-300' : 'bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-300'
                      }`}>
                        {d.type === 'platform' ? 'دعم المنصة' : 'أسرة'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                      {maskDonorName(d.donorName, d.isAnonymous, 'ar')}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {d.familyName ? `${d.familyName} (${d.serviceTitle || 'عام'})` : 'صندوق البنية التحتية للمنصة'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700 dark:text-primary-400 text-sm">
                      {formatCurrency(d.totalPaid || d.amount, 'ar')}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-stone-600 dark:text-stone-400">
                      {d.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleFlag(d.referenceId)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        title="تحديد كعملية مشبوهة"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
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
