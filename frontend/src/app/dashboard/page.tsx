'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import apiClient from '@/lib/api-client';
import { ShieldCheck, Activity, Sparkles, TrendingUp, ShoppingBag } from 'lucide-react';

interface Capability {
  key: string;
  name: string;
  enabled: boolean;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentWorkspaceName } = useWorkspaceStore();

  // Fetch workspace-specific capabilities
  const { data: capabilities, isLoading } = useQuery<Capability[]>({
    queryKey: ['capabilities', currentWorkspaceName],
    queryFn: async () => {
      const res = await apiClient.get('/v1/system/capabilities');
      return res.data.data;
    },
    enabled: !!currentWorkspaceName,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-primary/10 p-6 shadow-lg">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={14} />
              AI Product Intelligence Platform
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              반가워요, <span className="text-primary font-extrabold">{user?.name || user?.email}</span>님!
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              네이버 쇼핑 데이터 수집, JTBD 리뷰 분석 및 마케팅 기획안 자동 생성을 위한 작업 공간입니다.
            </p>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Total Revenue */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/20 p-5 shadow-sm transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">누적 소싱 분석액</span>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                <TrendingUp size={16} />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-200">₩45,210,000</h3>
            <p className="mt-1.5 text-xs text-emerald-500">지난달 대비 +12.3% 상승</p>
          </div>

          {/* Card 2: Active Audits */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/20 p-5 shadow-sm transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">활성 리뷰 분석 건수</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Activity size={16} />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-200">14건</h3>
            <p className="mt-1.5 text-xs text-primary">실시간 크롤러 분석 가동 중</p>
          </div>

          {/* Card 3: Products Analyzed */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/20 p-5 shadow-sm transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">소싱 기획 완료 상품</span>
              <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                <ShoppingBag size={16} />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-200">8개</h3>
            <p className="mt-1.5 text-xs text-purple-500">현재 워크스페이스 기준</p>
          </div>
        </div>

        {/* System Capabilities Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={20} />
                워크스페이스 라이선스 기능 활성화 정보
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                현재 활성화된 워크스페이스의 권한 등급에 따라 사용 가능한 기능 레지스트리입니다.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex py-6 justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : capabilities && capabilities.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((cap) => (
                <div
                  key={cap.key}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
                    cap.enabled
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-200'
                      : 'border-slate-800 bg-slate-950/20 opacity-50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        cap.enabled ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    ></span>
                    <span className="text-xs font-semibold">{cap.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                    {cap.enabled ? 'Active' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              워크스페이스 설정 정보가 유효하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
