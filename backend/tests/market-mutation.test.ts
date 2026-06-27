import { vi, describe, it, expect, beforeAll } from 'vitest';

const { mockQueryBuilder, setResolver } = vi.hoisted(() => {
  const qb: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  };

  const methods = ['select', 'insert', 'update', 'eq', 'is', 'order', 'range', 'maybeSingle', 'single'];
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
import { NaverScraperProvider } from '@/modules/scraper/providers/naver.provider.js';

const generateTestToken = (userId: string, email: string, expires: string = '1h') => {
  return jwt.sign({ userId, email, role: 'USER' }, env.JWT_SECRET, { expiresIn: expires });
};

describe('Market Mutation & Scraper integration Tests', () => {
  let app: any;
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  const otherUserId = '22222222-2222-2222-2222-222222222222';
  const testToken = generateTestToken(mockUserId, 'test@example.com');
  const expiredToken = generateTestToken(mockUserId, 'test@example.com', '-10s');
  const validUuid = '55555555-5555-5555-5555-555555555555';
  const runUuid = '99999999-9999-9999-9999-999999999999';

  beforeAll(async () => {
    app = await createApp();
  });

  describe('JWT Verification', () => {
    it('should return 401 when calling POST /api/v1/markets without JWT', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        payload: {
          runId: runUuid,
          totalMonthlySearch: 1000,
          trendSlope: 0.5,
          seasonalityClassification: 'LOW',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(401);
    });

    it('should return 401 when calling POST /api/v1/markets with expired JWT', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${expiredToken}` },
        payload: {
          runId: runUuid,
          totalMonthlySearch: 1000,
          trendSlope: 0.5,
          seasonalityClassification: 'LOW',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/v1/markets (Create Metric)', () => {
    it('should return 400 when body Zod validation fails', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${testToken}` },
        payload: {
          runId: 'not-a-uuid',
          totalMonthlySearch: -10, // Invalid search count
          trendSlope: 'not-a-number',
        },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when Run ID does not exist', async () => {
      // Mock run select returning null (Run not found)
      setResolver(() => Promise.resolve({ data: null, error: null }));

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${testToken}` },
        payload: {
          runId: runUuid,
          totalMonthlySearch: 1000,
          trendSlope: 0.5,
          seasonalityClassification: 'LOW',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 403 when Run ID belongs to another user (Owner mismatch)', async () => {
      // Mock run select returning run belonging to another user
      setResolver(() =>
        Promise.resolve({
          data: {
            run_id: runUuid,
            products: {
              workspaces: {
                org_id: otherUserId, // other user is owner
              },
            },
          },
          error: null,
        })
      );

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${testToken}` },
        payload: {
          runId: runUuid,
          totalMonthlySearch: 1000,
          trendSlope: 0.5,
          seasonalityClassification: 'LOW',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(403);
    });

    it('should return 409 when creating a duplicate metric (SQLSTATE 23505)', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // First query is the run owner verification check (passes)
          return Promise.resolve({
            data: {
              run_id: runUuid,
              products: {
                workspaces: {
                  org_id: mockUserId,
                },
              },
            },
            error: null,
          });
        } else {
          // Second query is the insert query (fails with unique constraint violation)
          return Promise.resolve({
            data: null,
            error: { code: '23505', message: 'duplicate key value violates unique constraint' },
          });
        }
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${testToken}` },
        payload: {
          runId: runUuid,
          totalMonthlySearch: 1000,
          trendSlope: 0.5,
          seasonalityClassification: 'LOW',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(409);
    });

    it('should return 201 when metric is successfully created', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // Owner verification query
          return Promise.resolve({
            data: {
              run_id: runUuid,
              products: {
                workspaces: {
                  org_id: mockUserId,
                },
              },
            },
            error: null,
          });
        } else {
          // Insert query
          return Promise.resolve({
            data: {
              metric_id: validUuid,
              run_id: runUuid,
              total_monthly_search: 2500,
              trend_slope: 1.15,
              seasonality_classification: 'MEDIUM',
              raw_trend_json: {},
            },
            error: null,
          });
        }
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/markets',
        headers: { authorization: `Bearer ${testToken}` },
        payload: {
          runId: runUuid,
          totalMonthlySearch: 2500,
          trendSlope: 1.15,
          seasonalityClassification: 'MEDIUM',
          rawTrendJson: {},
        },
      });
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.data.metricId).toBe(validUuid);
    });
  });

  describe('PATCH /api/v1/markets/:id (Update Metric)', () => {
    it('should return 404 when target metric is not owned or not found', async () => {
      // Mock findByIdWithOwner returning null (Not found)
      setResolver(() => Promise.resolve({ data: null, error: null }));

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
        payload: { totalMonthlySearch: 999 },
      });
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 when owner successfully updates metric', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // First query: ownership check (succeeds)
          return Promise.resolve({
            data: {
              metric_id: validUuid,
              run_id: runUuid,
              total_monthly_search: 2000,
              trend_slope: 0.5,
              seasonality_classification: 'LOW',
              raw_trend_json: {},
            },
            error: null,
          });
        } else {
          // Second query: update query (succeeds)
          return Promise.resolve({
            data: {
              metric_id: validUuid,
              run_id: runUuid,
              total_monthly_search: 5000,
              trend_slope: 0.5,
              seasonality_classification: 'LOW',
              raw_trend_json: {},
            },
            error: null,
          });
        }
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
        payload: { totalMonthlySearch: 5000 },
      });
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.data.totalMonthlySearch).toBe(5000);
    });
  });

  describe('DELETE /api/v1/markets/:id (Delete Metric)', () => {
    it('should return 404 when target metric is already soft-deleted or non-owned', async () => {
      // Mock findByIdWithOwner returning null (representing soft-deleted or non-existent)
      setResolver(() => Promise.resolve({ data: null, error: null }));

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 when owner successfully soft-deletes metric', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // First query: ownership check (succeeds)
          return Promise.resolve({
            data: {
              metric_id: validUuid,
              run_id: runUuid,
              total_monthly_search: 2000,
              trend_slope: 0.5,
              seasonality_classification: 'LOW',
              raw_trend_json: {},
            },
            error: null,
          });
        } else {
          // Second query: delete query (succeeds)
          return Promise.resolve({ data: null, error: null });
        }
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe('MockScraperService (Naver Provider Determinism)', () => {
    it('should always return identical, deterministic scraped data for a given keyword', async () => {
      const provider = new NaverScraperProvider();
      const keyword = '캠핑의자';

      const result1 = await provider.scrapeMarketData(keyword);
      const result2 = await provider.scrapeMarketData(keyword);

      expect(result1.totalMonthlySearch).toBe(result2.totalMonthlySearch);
      expect(result1.trendSlope).toBe(result2.trendSlope);
      expect(result1.seasonalityClassification).toBe(result2.seasonalityClassification);
      expect(result1.competitors.length).toBe(10);
      expect(result1.competitors[0].brandName).toBe(result2.competitors[0].brandName);
      expect(result1.competitors[0].price).toBe(result2.competitors[0].price);

      // Verify another keyword returns different values deterministically
      const otherResult = await provider.scrapeMarketData('선풍기');
      expect(result1.totalMonthlySearch).not.toBe(otherResult.totalMonthlySearch);
    });
  });
});
