import { Workspace } from './types.js';

export interface CreateWorkspaceDto {
  name: string;
}

export interface UpdateWorkspaceDto {
  name: string;
}

export interface WorkspaceResponseDto {
  workspaceId: string;
  orgId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const toResponseDto = (entity: Workspace): WorkspaceResponseDto => {
  return {
    workspaceId: entity.workspace_id,
    orgId: entity.org_id,
    name: entity.name,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  };
};
