import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <PublicHeader />
      <main className="flex-1 pb-16 sm:pb-0">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
