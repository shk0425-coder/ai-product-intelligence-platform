import { IBaseRepository, PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';

export interface Workspace {
  workspace_id: string; // UUID Primary Key
  org_id: string; // UUID Foreign Key (used as Owner ID / userId in this Sprint)
  name: string; // VARCHAR(100)
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
  deleted_at?: string | null; // TIMESTAMPTZ soft delete
}

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
  findByName(name: string): Promise<Workspace | null>;
  findAllByOwner(ownerId: string, options: PaginationOptions): Promise<PaginatedResult<Workspace>>;
}
