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

const generateTestToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email, role: 'USER' }, env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Market Module Integration Tests', () => {
  let app: any;
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  const testToken = generateTestToken(mockUserId, 'test@example.com');
  const validUuid = '55555555-5555-5555-5555-555555555555';

  beforeAll(async () => {
    app = await createApp();
  });

  describe('Authentication Check', () => {
    it('should return 401 when calling GET /api/v1/markets without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/markets',
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/markets', () => {
    it('should return paginated market metrics for whitelisted sort column', async () => {
      const mockMetricsList = [
        {
          metric_id: 'metric-1',
          run_id: 'run-1',
          total_monthly_search: 5000,
          trend_slope: 1.25,
          seasonality_classification: 'HIGH',
          raw_trend_json: [],
        },
      ];

      setResolver(() => {
        return Promise.resolve({
          data: mockMetricsList,
          count: mockMetricsList.length,
          error: null,
        });
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/markets?page=1&limit=20&sort=trend_slope&order=desc',
        headers: { authorization: `Bearer ${testToken}` },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.data.length).toBe(1);
      expect(body.data.data[0].metricId).toBe('metric-1');
      expect(body.data.data[0].trendSlope).toBe(1.25);
    });

    it('should return 400 when requesting non-whitelisted sort column', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/markets?sort=invalid_column',
        headers: { authorization: `Bearer ${testToken}` },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when limit exceeds 100', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/markets?limit=101',
        headers: { authorization: `Bearer ${testToken}` },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(body.success).toBe(false);
    });
  });

  describe('GET /api/v1/markets/:id', () => {
    it('should return 400 when param ID is not a valid UUID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/markets/invalid-uuid',
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when market metric is not found or not owned', async () => {
      setResolver(() => Promise.resolve({ data: null, error: null }));

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 with DTO when valid owner retrieves metric', async () => {
      setResolver(() => {
        return Promise.resolve({
          data: {
            metric_id: validUuid,
            run_id: 'run-1',
            total_monthly_search: 12000,
            trend_slope: -0.425,
            seasonality_classification: 'LOW',
            raw_trend_json: {},
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/markets/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.data.metricId).toBe(validUuid);
      expect(body.data.trendSlope).toBe(-0.425);
      expect(body.data.seasonalityClassification).toBe('LOW');
    });
  });
});
