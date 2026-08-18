import React, { useState, useEffect } from 'react';
import { getPendingVerifications, verifyFamily } from '../../api/admin';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateTime } from '../../lib/formatters';
import { ShieldCheck, CheckCircle2, XCircle, FileText, User, MapPin, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function FamilyVerificationPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject' | 'request_info'
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPendingVerifications();
        setQueue(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExecuteAction = async () => {
    if (!selectedCase) return;
    setIsProcessing(true);
    try {
      await verifyFamily(selectedCase.id, actionType, decisionNotes);
      setQueue(prev => prev.filter(item => item.id !== selectedCase.id));
      toast.success(actionType === 'approve' ? 'تم اعتماد وتوثيق ملف الأسرة بنجاح' : 'تم تسجيل قرار الرفض');
      setSelectedCase(null);
      setDecisionNotes('');
    } catch (err) {
      toast.error('حدث خطأ أثناء تنفيذ الإجراء');
    } finally {
      setIsProcessing(false);
    }
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
        title="طابور التحقق الميداني والاعتماد"
        subtitle="فحص طلبات الأسر المسجلة والتقارير الميدانية والمستندات قبل النشر العام"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {queue.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {queue.map((item) => (
              <Card key={item.id} className="p-6 sm:p-8 space-y-5 shadow-sm border-s-4 border-s-amber-500">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-xl">
                    {item.familyCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    بانتظار قرار المشرف
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {item.applicantNameAr}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-warm-500" />
                      {item.governorateAr}
                    </span>
                    <span>•</span>
                    <span>الأفراد: {item.membersCount}</span>
                    <span>•</span>
                    <span className="font-mono">{formatDateTime(item.submittedAt, 'ar')}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-1 text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 block">
                    تقرير الباحث ({item.assignedResearcherAr}):
                  </span>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {item.notesAr}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-primary-600" />
                    المستندات المرفقة: {item.documentsAttached} ملفات
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedCase(item);
                        setActionType('approve');
                      }}
                    >
                      اعتماد وتوثيق
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedCase(item);
                        setActionType('reject');
                      }}
                    >
                      رفض الطلب
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="طابور التحقق فارغ تماماً"
            description="تم فحص واعتماد كافة طلبات الأسر المسجلة في النظام بنجاح."
          />
        )}

      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={Boolean(selectedCase)}
        onClose={() => setSelectedCase(null)}
        title={actionType === 'approve' ? 'تأكيد اعتماد وتوثيق ملف الأسرة' : 'تسجيل قرار الرفض'}
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {actionType === 'approve'
              ? `سيتم نشر ملف الحالة (${selectedCase?.familyCode} - ${selectedCase?.applicantNameAr}) للمتبرعين في دليل الحالات العام.`
              : `سيتم إشعار مقدم الطلب بسبب الرفض وتوثيق القرار في سجلات التدقيق والأمان.`}
          </p>

          <Textarea
            label="ملاحظات وتوصيات المشرف (اختياري)"
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
            placeholder="اكتب أي ملاحظات موجهة للباحث الاجتماعي أو أرشيف الرقابة..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <Button variant="secondary" size="sm" onClick={() => setSelectedCase(null)}>
              إلغاء
            </Button>
            <Button
              variant={actionType === 'approve' ? 'primary' : 'danger'}
              size="sm"
              isLoading={isProcessing}
              onClick={handleExecuteAction}
            >
              {actionType === 'approve' ? 'تأكيد الاعتماد والنشر' : 'تأكيد الرفض'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
