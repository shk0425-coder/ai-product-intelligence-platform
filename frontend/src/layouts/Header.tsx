'use client';

import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useUiStore } from '@/stores/useUiStore';
import { User, Shield } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();
  const { currentWorkspaceName } = useWorkspaceStore();
  const { isSidebarOpen } = useUiStore();

  return (
    <header
      className={`fixed right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-6 backdrop-blur-md transition-all duration-300 ${
        isSidebarOpen ? 'left-64' : 'left-20'
      }`}
    >
      {/* Workspace Indicator Badge */}
      <div className="flex items-center gap-2">
        {currentWorkspaceName ? (
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-sm shadow-primary/5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            {currentWorkspaceName}
          </div>
        ) : (
          <span className="text-xs text-slate-500">선택된 워크스페이스 없음</span>
        )}
      </div>

      {/* User Info Bar */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{user.name || user.email}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                <Shield size={10} className="text-emerald-500" />
                {user.role || 'User'}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400">
              <User size={16} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
