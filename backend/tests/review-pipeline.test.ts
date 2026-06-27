import { vi, describe, it, expect, beforeAll } from 'vitest';

const { mockQueryBuilder, setResolver } = vi.hoisted(() => {
  const qb: any = {
    select: vi.fn(),
    insert: vi.fn(),
    upsert: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
  };

  const methods = ['select', 'insert', 'upsert', 'limit', 'maybeSingle'];
  for (const m of methods) {
    qb[m].mockImplementation(() => qb);
  }

  let resolver = () => Promise.resolve({ data: null, count: 0, error: null });
  qb.then = (onfulfilled: any) => resolver().then(onfulfilled);

  return {
    mockQueryBuilder: qb,
    setResolver: (newResolver: any) => {
      resolver = newResolver;
    },
  };
});

vi.mock('@/config/supabase.js', () => {
  return {
    supabase: {
      from: vi.fn().mockReturnValue(mockQueryBuilder),
    },
  };
});

import { createApp } from '@/app.js';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { ReviewMapper } from '@/modules/review/mapper.js';
import { ReviewRepository } from '@/modules/review/repository.js';
import { NaverReviewProvider } from '@/modules/scraper/providers/naver-review.provider.js';
import { ReviewDto } from '@/modules/review/types.js';

describe('Review Pipeline Tests', () => {
  let app: any;
  let adminToken: string;

  beforeAll(async () => {
    app = await createApp();
    adminToken = jwt.sign(
      { userId: 'test-user-id', email: 'test@example.com', role: 'ADMIN' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('Review Provider (NaverReviewProvider)', () => {
    it('should crawl review data from Naver Smartstore successfully', async () => {
      const mockApiResponse = {
        contents: [
          {
            id: 'review-1',
            productName: '강아지 유모차 에어',
            reviewScore: 5,
            reviewTitle: '최고입니다',
            reviewContent: '강아지가 너무 좋아하네요. 추천합니다.',
            createDate: '2026-06-27T12:00:00Z',
            writerMemberId: 'user123',
            helpfulnessCount: 3,
            brandName: 'BrandA',
            productOptionContent: '기본형 / 블랙',
          },
        ],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        json: async () => mockApiResponse,
      } as Response);

      const provider = new NaverReviewProvider();
      const results = await provider.crawl({ keyword: '강아지 유모차' });

      expect(fetchSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('review-1');
      expect(results[0].productName).toBe('강아지 유모차 에어');
      expect(results[0].rating).toBe(5);
      expect(results[0].content).toBe('강아지가 너무 좋아하네요. 추천합니다.');

      fetchSpy.mockRestore();
    });

    it('should throw an error on timeout', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockRejectedValue({
        name: 'AbortError',
        message: 'The user aborted a request.',
      });

      const provider = new NaverReviewProvider();
      await expect(provider.crawl({ keyword: '강아지 유모차' })).rejects.toThrow();

      fetchSpy.mockRestore();
    });

    it('should retry on 429 and eventually succeed', async () => {
      const mockApiResponse = {
        contents: [
          {
            id: 'review-2',
            productName: '강아지 유모차',
            reviewScore: 4,
          },
        ],
      };

      const fetchSpy = vi.spyOn(global, 'fetch')
        .mockRejectedValueOnce({ status: 429 } as any)
        .mockResolvedValueOnce({
          status: 200,
          json: async () => mockApiResponse,
        } as Response);

      const provider = new NaverReviewProvider();
      const results = await provider.crawl({ keyword: '강아지 유모차' });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('review-2');

      fetchSpy.mockRestore();
    });
  });

  describe('Review Mapper', () => {
    it('should correctly map raw review data to ReviewDto', () => {
      const rawData = {
        id: '12345',
        productName: '강아지 유모차',
        rating: 5,
        title: '대만족',
        content: '좋습니다',
        date: '2026-06-27',
        reviewer: 'reviewerA',
        helpfulCount: 10,
        brand: 'MyBrand',
        optionName: '레드',
        raw: { originalId: '12345' },
      };

      const dto = ReviewMapper.toDto(rawData, 'naver', '강아지 유모차', 'prod-111');

      expect(dto.provider).toBe('naver');
      expect(dto.keyword).toBe('강아지 유모차');
      expect(dto.providerReviewId).toBe('12345');
      expect(dto.productName).toBe('강아지 유모차');
      expect(dto.rating).toBe(5);
      expect(dto.reviewTitle).toBe('대만족');
      expect(dto.reviewContent).toBe('좋습니다');
      expect(dto.reviewer).toBe('reviewerA');
      expect(dto.helpfulCount).toBe(10);
      expect(dto.brand).toBe('MyBrand');
      expect(dto.optionName).toBe('레드');
      expect(dto.metadata.provider).toBe('naver');
      expect(dto.metadata.raw).toEqual({ originalId: '12345' });
    });

    it('should handle null/missing values gracefully with defaults', () => {
      const rawData = {
        id: '12345',
        productName: null as any,
        rating: null as any,
        title: null as any,
        content: null as any,
        date: null as any,
        reviewer: null as any,
        helpfulCount: null as any,
        brand: null as any,
        optionName: null as any,
        raw: {},
      };

      const dto = ReviewMapper.toDto(rawData, 'naver', '강아지 유모차', 'prod-111');

      expect(dto.productName).toBe('');
      expect(dto.rating).toBe(0);
      expect(dto.reviewTitle).toBe('');
      expect(dto.reviewContent).toBe('');
      expect(dto.reviewer).toBe('');
      expect(dto.reviewDate).toBe('');
      expect(dto.helpfulCount).toBe(0);
      expect(dto.brand).toBe('');
      expect(dto.optionName).toBe('');
    });
  });

  describe('Review Repository', () => {
    it('should return BulkInsertResult on success', async () => {
      const dtos: ReviewDto[] = [
        {
          provider: 'naver',
          keyword: '강아지 유모차',
          reviewId: '8d2a6a6c-94cc-408a-8a4c-5353e8fbcd32',
          providerProductId: 'prod-1',
          providerReviewId: 'rev-1',
          productName: '유모차',
          rating: 5,
          reviewTitle: '좋음',
          reviewContent: '내용',
          reviewer: 'user',
          reviewDate: '2026-06-27',
          helpfulCount: 0,
          brand: '',
          optionName: '',
          collectedAt: new Date().toISOString(),
          metadata: {},
        },
      ];

      setResolver(() =>
        Promise.resolve({
          data: [{ review_id: '8d2a6a6c-94cc-408a-8a4c-5353e8fbcd32' }],
          error: null,
        })
      );

      const repository = new ReviewRepository(app.supabase);
      const result = await repository.bulkInsert(dtos);

      expect(result.insertedCount).toBe(1);
      expect(result.duplicateCount).toBe(0);
      expect(result.failedCount).toBe(0);
    });

    it('should count duplicate skips correctly', async () => {
      const dtos: ReviewDto[] = [
        {
          provider: 'naver',
          keyword: '강아지 유모차',
          reviewId: '8d2a6a6c-94cc-408a-8a4c-5353e8fbcd32',
          providerProductId: 'prod-1',
          providerReviewId: 'rev-1',
          productName: '유모차',
          rating: 5,
          reviewTitle: '좋음',
          reviewContent: '내용',
          reviewer: 'user',
          reviewDate: '2026-06-27',
          helpfulCount: 0,
          brand: '',
          optionName: '',
          collectedAt: new Date().toISOString(),
          metadata: {},
        },
      ];

      setResolver(() =>
        Promise.resolve({
          data: [],
          error: null,
        })
      );

      const repository = new ReviewRepository(app.supabase);
      const result = await repository.bulkInsert(dtos);

      expect(result.insertedCount).toBe(0);
      expect(result.duplicateCount).toBe(1);
      expect(result.failedCount).toBe(0);
    });

    it('should map database constraints/errors to failedCount', async () => {
      const dtos: ReviewDto[] = [
        {
          provider: 'naver',
          keyword: '강아지',
          reviewId: 'invalid-uuid',
          providerProductId: 'prod-1',
          providerReviewId: 'rev-1',
          productName: '유모차',
          rating: 5,
          reviewTitle: '좋음',
          reviewContent: '내용',
          reviewer: 'user',
          reviewDate: '2026-06-27',
          helpfulCount: 0,
          brand: '',
          optionName: '',
          collectedAt: new Date().toISOString(),
          metadata: {},
        },
      ];

      setResolver(() =>
        Promise.resolve({
          data: null,
          error: { message: 'Invalid UUID format', code: '22P02' } as any,
        })
      );

      const repository = new ReviewRepository(app.supabase);
      const result = await repository.bulkInsert(dtos);

      expect(result.insertedCount).toBe(0);
      expect(result.duplicateCount).toBe(0);
      expect(result.failedCount).toBe(1);
    });
  });

  describe('Crawl API (POST /api/v1/reviews/crawl)', () => {
    it('should return 401 if unauthorized', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/crawl',
        payload: {
          provider: 'naver',
          keyword: '강아지 유모차',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 400 if validation fails', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/crawl',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          provider: 'amazon',
          keyword: '',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Only naver provider is allowed');
    });

    it('should return 200 and return pipeline report on success', async () => {
      const mockApiResponse = {
        contents: [
          {
            id: 'review-1',
            productName: '강아지 유모차 에어',
            reviewScore: 5,
            reviewTitle: '최고입니다',
            reviewContent: '강아지가 너무 좋아하네요.',
            createDate: '2026-06-27T12:00:00Z',
            writerMemberId: 'user123',
            helpfulnessCount: 3,
          },
        ],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        json: async () => mockApiResponse,
      } as Response);

      setResolver(() =>
        Promise.resolve({
          data: [{ review_id: 'some-uuid' }],
          error: null,
        })
      );

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/crawl',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          provider: 'naver',
          keyword: '강아지 유모차',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.provider).toBe('naver');
      expect(body.data.keyword).toBe('강아지 유모차');
      expect(body.data.insertedCount).toBe(1);
      expect(body.data.duplicateCount).toBe(0);
      expect(body.data.failedCount).toBe(0);

      fetchSpy.mockRestore();
    });
  });
});
