import crypto from 'crypto';
import { ReviewDto, RawReviewData } from './types.js';

export function generateDeterministicUuid(seed: string): string {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32),
  ].join('-');
}

export class ReviewMapper {
  static toDto(
    raw: RawReviewData,
    provider: string,
    keyword: string,
    providerProductId: string
  ): ReviewDto {
    const providerReviewId = raw.id || '';
    const reviewId = generateDeterministicUuid(`${provider}:${providerProductId}:${providerReviewId}`);
    const collectedAt = new Date().toISOString();

    return {
      provider,
      keyword,
      reviewId,
      providerProductId,
      providerReviewId,
      productName: raw.productName || '',
      rating: typeof raw.rating === 'number' ? raw.rating : 0,
      reviewTitle: raw.title || '',
      reviewContent: raw.content || '',
      reviewer: raw.reviewer || '',
      reviewDate: raw.date || '',
      helpfulCount: typeof raw.helpfulCount === 'number' ? raw.helpfulCount : 0,
      brand: raw.brand || '',
      optionName: raw.optionName || '',
      collectedAt,
      metadata: {
        provider,
        providerVersion: '1.0.0',
        collectedAt,
        raw: raw.raw || {},
      },
    };
  }
}
