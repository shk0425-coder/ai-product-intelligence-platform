'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUiStore } from '@/stores/useUiStore';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        {/* Header */}
        <Header />

        {/* Content Viewport */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
