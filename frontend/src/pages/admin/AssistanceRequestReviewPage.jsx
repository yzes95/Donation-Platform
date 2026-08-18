import React, { useState, useEffect } from 'react';
import { mockServices } from '../../data/services';
import { reviewAssistanceRequest } from '../../api/admin';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/formatters';
import { ListFilter, CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AssistanceRequestReviewPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get services that are pending or active
    setRequests(mockServices);
    setLoading(false);
  }, []);

  const handleReview = async (id, decision) => {
    try {
      await reviewAssistanceRequest(id, decision);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: decision === 'approve' ? 'active' : 'rejected' } : r));
      toast.success(decision === 'approve' ? 'تمت الموافقة ونشر الاحتياج' : 'تم رفض الاحتياج');
    } catch {
      toast.error('حدث خطأ');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="مراجعة واعتماد طلبات المساعدة والخدمات"
        subtitle="فحص التكاليف المالية المحددة والمستندات الطبية والفواتير لكل احتياج"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((item) => (
            <Card key={item.id} className="p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg">
                  {item.code}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {item.titleAr}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.descriptionAr}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between text-xs">
                <span className="text-stone-500">المبلغ المطلوب:</span>
                <span className="font-bold font-mono text-primary-700 dark:text-primary-400 text-sm">
                  {formatCurrency(item.targetAmount, 'ar')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-stone-400">المستفيد: {item.beneficiaryAr}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReview(item.id, 'approve')}
                    className="text-xs py-1.5 text-emerald-600 dark:text-emerald-400"
                  >
                    موافقة ونشر
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReview(item.id, 'reject')}
                    className="text-xs py-1.5 text-red-600 dark:text-red-400"
                  >
                    رفض
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
