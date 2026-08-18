import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { useAuth } from '../store/AuthContext';
import { Spinner } from '../components/ui/Spinner';

export function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-surface-dark text-stone-900 dark:text-stone-100">
      <DashboardSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0 overflow-x-hidden">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
