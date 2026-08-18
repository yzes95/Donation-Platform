import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFamilies } from '../../api/families';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { Users, Eye, Edit3, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function FamilyManagementPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await getFamilies();
        setFamilies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = families.filter(f => {
    const q = search.toLowerCase();
    const matchesSearch = f.nameAr.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.governorateAr.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id) => {
    setFamilies(prev => prev.map(f => {
      if (f.id === id) {
        const next = f.status === 'verified' ? 'suspended' : 'verified';
        toast.info(`تم تغيير حالة الملف إلى (${next})`);
        return { ...f, status: next };
      }
      return f;
    }));
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
        title="إدارة الأسر والملفات الميدانية"
        subtitle="سجل جميع الأسر المسجلة والتحكم في حالات الاعتماد والتعليق"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="ابحث برقم الملف أو اسم الأسرة أو المحافظة..."
            className="flex-1 max-w-md"
          />

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2.5 text-stone-800 dark:text-stone-200"
            >
              <option value="all">كافة الحالات ({families.length})</option>
              <option value="verified">معتمد وموثق</option>
              <option value="pending_verification">قيد التحقق</option>
              <option value="suspended">معلق</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <tr>
                  <th className="py-3 px-4 text-start font-bold">كود الملف</th>
                  <th className="py-3 px-4 text-start font-bold">اسم الحالة التعريفي</th>
                  <th className="py-3 px-4 text-start font-bold">المحافظة</th>
                  <th className="py-3 px-4 text-start font-bold">الأفراد</th>
                  <th className="py-3 px-4 text-start font-bold">المجموع / الهدف</th>
                  <th className="py-3 px-4 text-start font-bold">حالة الاعتماد</th>
                  <th className="py-3 px-4 text-center font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {f.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800 dark:text-stone-200">
                      {f.nameAr}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {f.governorateAr}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {f.membersCount} أفراد
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="text-primary-700 dark:text-primary-400">{formatCurrency(f.totalRaised, 'ar')}</span>
                      <span className="text-stone-400 font-normal"> / {formatCurrency(f.totalTarget, 'ar')}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to={`/families/${f.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-primary-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="معاينة الملف"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleStatus(f.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                          title="تغيير حالة الاعتماد"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      </div>
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
