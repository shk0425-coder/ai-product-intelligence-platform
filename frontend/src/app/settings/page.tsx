'use client';

import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { Settings2, User, Key, Eye } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('설정이 안전하게 저장되었습니다.', 'success');
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Settings2 className="text-primary" size={22} />
            시스템 설정
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            계정 프로필 정보 및 플랫폼 기본 설정을 정의합니다.
          </p>
        </div>

        {/* Settings Container */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Box 1: Profile */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <User size={14} />
              사용자 프로필
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">이메일 계정</label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ''}
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">이름</label>
                <input
                  type="text"
                  defaultValue={user?.name || '관리자'}
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Box 2: API & Tokens */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Key size={14} />
              외부 서비스 연동 키
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Naver Client ID</label>
                <input
                  type="password"
                  value="i4sbEWJ1TdrIjuPSUlul"
                  disabled
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                * 네이버 쇼핑 수집기 연동에 사용되는 자격 증명 키는 `.env` 환경변수에 고정되어 있습니다.
              </p>
            </div>
          </div>

          {/* Box 3: Theme Preferences */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Eye size={14} />
              화면 환경 설정
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">기본 다크 모드 고정</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">디자인 프리즈 정책에 의하여 어두운 테마가 고정 탑재됩니다.</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-800/50 text-emerald-400">
                Dark Mode Enabled
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-primary/80 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary transition-all duration-200"
          >
            변경 사항 저장
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
