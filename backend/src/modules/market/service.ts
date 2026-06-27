import { IMarketRepository } from './types.js';
import { MarketMetric } from './types.js';
import { PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';
import { MarketNotFoundError } from '@/common/errors/index.js';

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
}
