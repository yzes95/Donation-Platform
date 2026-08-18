import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { getFamilyServices } from '../../api/families';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../lib/formatters';
import { PlusCircle, ListTodo, Edit3, Trash2, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function NeedsManagementPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const currentLang = i18n.language || 'ar';
  const isArabic = currentLang.startsWith('ar');

  const familyId = user?.familyId || 'fam-01';
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    async function load() {
      try {
        const data = await getFamilyServices(familyId);
        setNeeds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [familyId]);

  const handleDelete = () => {
    setNeeds(prev => prev.filter(n => n.id !== deleteDialog.id));
    setDeleteDialog({ open: false, id: null });
    toast.success('تم حذف طلب الاحتياج بنجاح');
  };

  const filtered = statusFilter === 'all'
    ? needs
    : needs.filter(n => n.status === statusFilter);

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
        title={t('menu.needsManagement')}
        subtitle="إدارة وتعديل خدمات واحتياجات الأسرة ومتابعة تقدم التبرعات"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top bar with create CTA and filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">تصفية حسب الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-800 dark:text-stone-200"
            >
              <option value="all">كافة الاحتياجات ({needs.length})</option>
              <option value="active">النشطة حالياً</option>
              <option value="pending_review">قيد المراجعة</option>
              <option value="funded">مكتملة التمويل</option>
            </select>
          </div>

          <Link to="/dashboard/needs/create" className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>{t('needsTable.newNeedBtn')}</span>
          </Link>
        </div>

        {/* Needs List */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((item) => (
              <Card key={item.id} className="p-6 space-y-4 shadow-sm hover:border-primary-500/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-mono font-bold text-xs">
                        {item.code}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 truncate">
                      {isArabic ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {isArabic ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>

                  {/* Progress & Target */}
                  <div className="w-full lg:w-56 space-y-1.5 shrink-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">تم جمع: <strong className="text-primary-700 dark:text-primary-400 font-bold">{formatCurrency(item.raisedAmount, currentLang)}</strong></span>
                      <span className="font-bold">{Math.round((item.raisedAmount / item.targetAmount) * 100)}%</span>
                    </div>
                    <ProgressBar value={item.raisedAmount} max={item.targetAmount} size="sm" variant="primary" />
                    <div className="text-[11px] text-stone-400 text-end">
                      الهدف: {formatCurrency(item.targetAmount, currentLang)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
                    <Link
                      to={`/services/${item.id}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                      title="معاينة"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/dashboard/needs/edit/${item.id}`}
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteDialog({ open: true, id: item.id })}
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ListTodo}
            title="لا توجد احتياجات مطابقة"
            description="لم يتم العثور على خدمات ضمن التصنيف المحدد."
            actionLabel="إضافة احتياج جديد"
            onAction={() => {}}
          />
        )}

      </div>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="حذف طلب المساعدة"
        message="هل أنت متأكد من رغبتك في حذف هذا الاحتياج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="تأكيد الحذف"
      />
    </div>
  );
}
