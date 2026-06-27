import { BaseRepository } from '@/repositories/implementations/base.repository.js';
import { Workspace, IWorkspaceRepository } from './types.js';
import { PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';
import { DatabaseError } from '@/common/errors/index.js';
import { SupabaseClient } from '@supabase/supabase-js';

export class WorkspaceRepository extends BaseRepository<Workspace> implements IWorkspaceRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workspaces', 'workspace_id');
  }

  async findByName(name: string): Promise<Workspace | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('name', name)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(error.message);
    }
    return data as Workspace | null;
  }

  async findAllByOwner(ownerId: string, options: PaginationOptions): Promise<PaginatedResult<Workspace>> {
    const { page, limit, sort, order } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // org_id holds the user ID to map ownership
    const { data, count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .eq('org_id', ownerId)
      .is('deleted_at', null)
      .order(sort, { ascending: order === 'asc' })
      .range(from, to);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      data: (data ?? []) as Workspace[],
      total: count ?? 0,
      page,
      limit,
    };
  }
}
