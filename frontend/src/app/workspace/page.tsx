'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useToast } from '@/providers/ToastProvider';
import apiClient from '@/lib/api-client';
import { Layers, CheckCircle2, ChevronRight } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function WorkspacePage() {
  const { toast } = useToast();
  const { currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();

  const { data: workspaces, isLoading } = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/workspaces');
      return res.data.data;
    },
  });

  const handleSelectWorkspace = (w: Workspace) => {
    setCurrentWorkspace({ id: w.id, name: w.name });
    toast(`워크스페이스가 "${w.name}"(으)로 전환되었습니다.`, 'success');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Layers className="text-primary" size={22} />
            워크스페이스 관리
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            계정에 연결된 작업 공간을 선택하고 관리합니다. 모든 분석 데이터는 현재 선택된 워크스페이스를 기준으로 격리됩니다.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
          </div>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {workspaces.map((w) => {
              const isSelected = currentWorkspaceId === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => handleSelectWorkspace(w)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                      : 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div className="absolute right-4 top-4 text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-primary transition-colors">
                    {w.name}
                  </h3>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      <p>역할: <span className="font-semibold text-slate-300">{w.role}</span></p>
                      <p className="mt-0.5">생성일: {new Date(w.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!isSelected && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:text-slate-300">
                        선택하기
                        <ChevronRight size={12} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-8 text-center text-slate-500">
            사용 가능한 워크스페이스가 존재하지 않습니다.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
