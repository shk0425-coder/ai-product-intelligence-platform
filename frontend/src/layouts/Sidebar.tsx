'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Settings, Layers, Menu, ChevronLeft, LogOut } from 'lucide-react';
import { useUiStore } from '@/stores/useUiStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/providers/ToastProvider';
import apiClient from '@/lib/api-client';
import axios from 'axios';

interface Workspace {
  id: string;
  name: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);

  // Fetch workspaces list
  const { data: workspaces } = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/workspaces');
      return res.data.data;
    },
  });

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = workspaces?.find((w) => w.id === selectedId);
    if (selected) {
      setCurrentWorkspace(selected);
      toast(`워크스페이스가 "${selected.name}"(으)로 변경되었습니다.`, 'info');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      clearAuth();
      clearWorkspace();
      toast('로그아웃 되었습니다.', 'success');
      router.push('/login');
    } catch {
      toast('로그아웃 도중 오류가 발생했습니다.', 'error');
    }
  };

  const navItems = [
    { name: '홈 대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '워크스페이스', href: '/workspace', icon: Layers },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-20 flex flex-col border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-xl transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-emerald-500 font-bold text-white">
            N
          </div>
          {isSidebarOpen && (
            <span className="text-sm font-bold tracking-tight text-slate-200 whitespace-nowrap">
              AI Product Intelligence
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Workspace Switcher */}
      {isSidebarOpen && workspaces && workspaces.length > 0 && (
        <div className="px-4 py-4 border-b border-slate-800/80">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Workspace
          </label>
          <div className="relative mt-1.5">
            <select
              value={currentWorkspaceId || ''}
              onChange={handleWorkspaceChange}
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-300 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id} className="bg-slate-900 text-slate-300">
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-primary' : 'text-slate-400'} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200"
        >
          <LogOut size={18} />
          {isSidebarOpen && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}
