'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import apiClient from '@/lib/api-client';

interface WorkspaceResponse {
  id: string;
  name: string;
}

export default function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore();

  const { data: workspaces, isSuccess } = useQuery<WorkspaceResponse[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/workspaces');
      // The backend returns successResponse shape: { success: true, data: [...] }
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isSuccess && workspaces && workspaces.length > 0 && !currentWorkspaceId) {
      // Auto-select first workspace on initial load
      setCurrentWorkspace({
        id: workspaces[0].id,
        name: workspaces[0].name,
      });
    }
  }, [isSuccess, workspaces, currentWorkspaceId, setCurrentWorkspace]);

  return <>{children}</>;
}
