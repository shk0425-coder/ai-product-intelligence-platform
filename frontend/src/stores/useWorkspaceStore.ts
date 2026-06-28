import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceState {
  currentWorkspaceId: string | null;
  currentWorkspaceName: string | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspaceId: null,
  currentWorkspaceName: null,
  setCurrentWorkspace: (workspace) =>
    set({
      currentWorkspaceId: workspace ? workspace.id : null,
      currentWorkspaceName: workspace ? workspace.name : null,
    }),
  clearWorkspace: () => set({ currentWorkspaceId: null, currentWorkspaceName: null }),
}));
