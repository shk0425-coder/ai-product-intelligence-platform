import { BaseRepository } from '@/repositories/implementations/base.repository.js';
import { MarketMetric, IMarketRepository } from './types.js';
import { PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';
import { DatabaseError } from '@/common/errors/index.js';
import { SupabaseClient } from '@supabase/supabase-js';

export class MarketRepository extends BaseRepository<MarketMetric> implements IMarketRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'market_metrics', 'metric_id');
  }

  async findByIdWithOwner(id: string, ownerId: string): Promise<MarketMetric | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        analysis_runs!inner(
          product_id,
          products!inner(
            workspace_id,
            workspaces!inner(
              org_id
            )
          )
        )
      `)
      .eq('metric_id', id)
      .is('deleted_at', null)
      .eq('analysis_runs.products.workspaces.org_id', ownerId)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(error.message);
    }
    return data as MarketMetric | null;
  }

  async findAllByOwner(ownerId: string, options: PaginationOptions): Promise<PaginatedResult<MarketMetric>> {
    const { page, limit, sort, order } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        analysis_runs!inner(
          product_id,
          products!inner(
            workspace_id,
            workspaces!inner(
              org_id
            )
          )
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .eq('analysis_runs.products.workspaces.org_id', ownerId)
      .order(sort, { ascending: order === 'asc' })
      .range(from, to);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      data: (data ?? []) as MarketMetric[],
      total: count ?? 0,
      page,
      limit,
    };
  }
}
