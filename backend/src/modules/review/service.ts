import { IReviewRepository, ReviewDto, BulkInsertResult, IReviewProvider } from './types.js';
import { ReviewMapper } from './mapper.js';
import { NaverReviewProvider } from '../scraper/providers/naver-review.provider.js';

export class ReviewService {
  private providers = new Map<string, IReviewProvider>();

  constructor(private readonly reviewRepository: IReviewRepository) {
    this.registerProvider(new NaverReviewProvider());
  }

  registerProvider(provider: IReviewProvider): void {
    this.providers.set(provider.getName(), provider);
  }

  getProvider(name: string): IReviewProvider | undefined {
    return this.providers.get(name);
  }

  async crawl(providerName: string, keyword: string): Promise<BulkInsertResult> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Review provider "${providerName}" not registered.`);
    }

    const rawData = await provider.crawl({ keyword });

    const providerProductId = 'smartstore-product';
    const dtos: ReviewDto[] = rawData.map((raw) =>
      ReviewMapper.toDto(raw, providerName, keyword, providerProductId)
    );

    return this.reviewRepository.bulkInsert(dtos);
  }
}
