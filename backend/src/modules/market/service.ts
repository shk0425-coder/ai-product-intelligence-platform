import { IMarketRepository } from './types.js';
import { MarketMetric } from './types.js';
import { PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';
import { CreateMarketMetricDto, UpdateMarketMetricDto } from './dto.js';
import {
  MarketNotFoundError,
  MarketForbiddenError,
  MarketMetricAlreadyExistsError,
  ValidationError,
} from '@/common/errors/index.js';

export class MarketService {
  constructor(private readonly marketRepository: IMarketRepository) {}

  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResult<MarketMetric>> {
    return this.marketRepository.findAllByOwner(userId, options);
  }

  async findById(id: string, userId: string): Promise<MarketMetric> {
    const metric = await this.marketRepository.findByIdWithOwner(id, userId);
    if (!metric) {
      throw new MarketNotFoundError();
    }
    return metric;
  }

  async create(dto: CreateMarketMetricDto, userId: string): Promise<MarketMetric> {
    // 1. Verify that the run exists and is owned by the current user
    const isOwner = await this.marketRepository.verifyRunOwner(dto.runId, userId);

    if (isOwner === null) {
      throw new ValidationError(`Run with ID "${dto.runId}" does not exist`);
    }

    if (isOwner === false) {
      throw new MarketForbiddenError('You do not own the workspace associated with this run');
    }

    // 2. Insert with unique constraint handling
    try {
      const metric = await this.marketRepository.create({
        run_id: dto.runId,
        total_monthly_search: dto.totalMonthlySearch,
        trend_slope: dto.trendSlope,
        seasonality_classification: dto.seasonalityClassification,
        raw_trend_json: dto.rawTrendJson,
      });
      return metric;
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (
        err.code === '23505' ||
        err.message?.includes('23505') ||
        err.message?.includes('uq_market_metrics_run_id') ||
        err.message?.includes('duplicate key')
      ) {
        throw new MarketMetricAlreadyExistsError(`Market metric already exists for run ID "${dto.runId}"`);
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateMarketMetricDto, userId: string): Promise<MarketMetric> {
    // 1. Verify existence and ownership (throws 404 if soft-deleted or non-owned)
    await this.findById(id, userId);

    // 2. Perform update
    const updateData: Partial<MarketMetric> = {};
    if (dto.totalMonthlySearch !== undefined) updateData.total_monthly_search = dto.totalMonthlySearch;
    if (dto.trendSlope !== undefined) updateData.trend_slope = dto.trendSlope;
    if (dto.seasonalityClassification !== undefined) updateData.seasonality_classification = dto.seasonalityClassification;
    if (dto.rawTrendJson !== undefined) updateData.raw_trend_json = dto.rawTrendJson;

    return this.marketRepository.update(id, updateData);
  }

  async delete(id: string, userId: string): Promise<void> {
    // 1. Verify existence and ownership (throws 404 if soft-deleted or non-owned)
    await this.findById(id, userId);

    // 2. Perform soft delete
    return this.marketRepository.delete(id);
  }
}
