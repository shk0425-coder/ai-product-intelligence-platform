import { IBaseRepository, PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';

export interface MarketMetric {
  metric_id: string; // UUID Primary Key
  run_id: string; // UUID Foreign Key
  total_monthly_search: number;
  trend_slope: number;
  seasonality_classification: string;
  raw_trend_json: Record<string, unknown> | unknown[]; // JSONB
  deleted_at?: string | null; // TIMESTAMPTZ soft delete
}

export interface IMarketRepository extends IBaseRepository<MarketMetric> {
  findByIdWithOwner(id: string, ownerId: string): Promise<MarketMetric | null>;
  findAllByOwner(ownerId: string, options: PaginationOptions): Promise<PaginatedResult<MarketMetric>>;
  verifyRunOwner(runId: string, userId: string): Promise<boolean | null>;
}
