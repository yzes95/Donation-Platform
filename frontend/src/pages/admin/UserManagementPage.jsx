import React, { useState } from 'react';
import { mockUsers } from '../../data/users';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserCheck, ShieldAlert, UserPlus, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagementPage() {
  const [users, setUsers] = useState(mockUsers);

  const toggleUser = (id) => {
    toast.info(`تم تحديث حالة المستخدم ${id}`);
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="إدارة المستخدمين والمشرفين والباحثين"
        subtitle="التحكم في صلاحيات الوصول والحسابات المسجلة لممثلي الأسر وفريق العمل"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex justify-end">
          <Button size="sm" variant="primary" icon={UserPlus} onClick={() => toast.info('إضافة مستخدم جديد')}>
            إضافة مشرف / باحث ميداني
          </Button>
        </div>

        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <tr>
                  <th className="py-3 px-4 text-start font-bold">المستخدم</th>
                  <th className="py-3 px-4 text-start font-bold">الدور والصلاحية</th>
                  <th className="py-3 px-4 text-start font-bold">البريد الإلكتروني</th>
                  <th className="py-3 px-4 text-start font-bold">الهاتف</th>
                  <th className="py-3 px-4 text-start font-bold">تاريخ الانضمام</th>
                  <th className="py-3 px-4 text-center font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <span className="font-bold text-stone-900 dark:text-stone-100 block">{u.name}</span>
                        <span className="text-[10px] text-stone-400">{u.nationalId || 'مسؤول معتمد'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-stone-900 text-white dark:bg-stone-700'
                          : 'bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-300'
                      }`}>
                        {u.role === 'admin' ? 'مشرف نظام (Admin)' : 'ممثل أسرة (Family Rep)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600 dark:text-stone-300">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      {u.phone}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {u.joinedDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button size="sm" variant="ghost" className="text-xs" onClick={() => toggleUser(u.id)}>
                        تعديل الصلاحيات
                      </Button>
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
