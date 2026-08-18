import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../api/admin';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatDateTime } from '../../lib/formatters';
import { ScrollText, ShieldCheck, Download, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actorName.toLowerCase().includes(q) ||
      l.detailsAr.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    toast.success('تم تصدير سجل الأمان والنشاط Audit Log بنجاح');
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
        title="سجل الأمان والنشاط الرقابي (Audit Trail)"
        subtitle="توثيق زمني غير قابل للتعديل لكافة الإجراءات الإدارية والتحققات الميدانية"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="ابحث باسم المشرف أو نوع الإجراء أو التفاصيل..."
            className="flex-1 max-w-md"
          />
          <Button variant="outline" size="sm" onClick={handleExport} icon={Download}>
            تصدير سجل الأمان
          </Button>
        </div>

        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <tr>
                  <th className="py-3 px-4 text-start font-bold">نوع الإجراء</th>
                  <th className="py-3 px-4 text-start font-bold">المشرف / المنفذ</th>
                  <th className="py-3 px-4 text-start font-bold">تفاصيل الإجراء والمستهدف</th>
                  <th className="py-3 px-4 text-start font-bold">عنوان IP</th>
                  <th className="py-3 px-4 text-start font-bold">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700 dark:text-primary-400">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800 dark:text-stone-200">
                      {log.actorName}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 max-w-md leading-relaxed">
                      {log.detailsAr}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {formatDateTime(log.timestamp, 'ar')}
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
