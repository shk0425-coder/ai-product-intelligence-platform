import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { IdentityGenerator } from '../src/modules/ai/identity-generator.js';
import { AIAnalysisRepository } from '../src/modules/ai/repository.js';
import { ReviewAnalysisPersistenceService } from '../src/modules/ai/persistence-service.js';
import { ReviewAnalysisQueryService } from '../src/modules/ai/query-service.js';
import { ReviewAnalyzerService } from '../src/modules/ai/service.js';
import { createApp } from '../src/app.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

// Mock data
const mockReviews = [
  { raw_text: '바퀴 조작이 편하고 정말 가볍네요.', rating: 5, collected_at: '2026-06-27T12:00:00Z' },
  { raw_text: '접는 법이 조금 어렵지만 안정감은 뛰어납니다.', rating: 4, collected_at: '2026-06-27T11:00:00Z' },
];

const mockValidResponse = {
  summary: '가볍고 안정적이나 바퀴 소음이 아쉽다는 평가입니다.',
  strengths: ['가벼운 무게', '우수한 주행감'],
  weaknesses: ['바퀴 유격 소음'],
  complaints: ['접이 폴딩 어려움'],
  jtbd: ['강아지와 편안한 야외 산책'],
  keywords: ['개모차', '바퀴'],
  sentiment: {
    positive: 70,
    neutral: 10,
    negative: 20,
  },
};

const mockStoredRow = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  analysis_identity: 'mocked-identity-hash',
  provider: 'gemini',
  model: 'gemini-1.5-flash',
  prompt_version: 'v1',
  temperature: 0.2,
  max_output_tokens: 4096,
  keyword: '개모차',
  review_count: 2,
  summary: '가볍고 안정적입니다.',
  strengths: ['가벼운 무게'],
  weaknesses: ['소음'],
  complaints: ['폴딩'],
  jtbd: ['산책'],
  keywords: ['개모차'],
  sentiment: { positive: 70, neutral: 10, negative: 20 },
  prompt_tokens: 150,
  completion_tokens: 80,
  total_tokens: 230,
  processing_time_ms: 500,
  created_at: '2026-06-27T12:00:00Z',
};

// Query Builder Mock Helper
function createMockQueryBuilder(data: any, error: any = null) {
  const qb: any = {};
  const methods = ['select', 'insert', 'eq', 'order', 'limit', 'maybeSingle', 'single', 'ilike'];
  for (const m of methods) {
    qb[m] = vi.fn().mockImplementation(() => qb);
  }
  qb.then = (onfulfilled: any) => Promise.resolve({ data, error }).then(onfulfilled);
  return qb;
}

describe('AI Review Analysis Persistence & Storage Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Identity Generator Tests
  describe('IdentityGenerator', () => {
    const input = {
      provider: 'gemini',
      keyword: '개모차',
      reviewCount: 10,
      latestCollectedAt: '2026-06-27T12:00:00Z',
      promptVersion: 'v1',
      model: 'gemini-1.5-flash',
      temperature: 0.2,
      maxOutputTokens: 4096,
    };

    it('should generate a valid 64-char hex SHA-256 hash', () => {
      const hash = IdentityGenerator.generate(input);
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should return identical hash for identical inputs', () => {
      const hash1 = IdentityGenerator.generate(input);
      const hash2 = IdentityGenerator.generate({ ...input });
      expect(hash1).toBe(hash2);
    });

    it('should generate different hash for different PromptVersion', () => {
      const hash1 = IdentityGenerator.generate(input);
      const hash2 = IdentityGenerator.generate({ ...input, promptVersion: 'v2' });
      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hash for different Model', () => {
      const hash1 = IdentityGenerator.generate(input);
      const hash2 = IdentityGenerator.generate({ ...input, model: 'gemini-pro' });
      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hash for different Temperature', () => {
      const hash1 = IdentityGenerator.generate(input);
      const hash2 = IdentityGenerator.generate({ ...input, temperature: 0.7 });
      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hash for different MaxOutputTokens', () => {
      const hash1 = IdentityGenerator.generate(input);
      const hash2 = IdentityGenerator.generate({ ...input, maxOutputTokens: 2048 });
      expect(hash1).not.toBe(hash2);
    });
  });

  // 2. Migration Tests (SQL Structure validation)
  describe('Database Migration', () => {
    it('should contain exact table definition, constraints and indexes', () => {
      const migrationPath = path.resolve(__dirname, '../../database/migrations/31_create_review_analysis_results.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');

      expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.review_analysis_results');
      expect(sql).toContain('analysis_identity VARCHAR(64) NOT NULL');
      expect(sql).toContain('CONSTRAINT uq_review_analysis_results_identity UNIQUE (analysis_identity)');
      expect(sql).toContain('idx_review_analysis_results_identity');
      expect(sql).toContain('idx_review_analysis_results_keyword');
      expect(sql).toContain('idx_review_analysis_results_created_at_desc');
    });
  });

  // 3. Repository Tests
  describe('AIAnalysisRepository', () => {
    it('should save analysis and return StoredAnalysis DTO', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue(createMockQueryBuilder(mockStoredRow)),
      } as any;

      const repo = new AIAnalysisRepository(mockSupabase);
      const toSave = {
        analysisIdentity: 'identity-hash',
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        promptVersion: 'v1',
        temperature: 0.2,
        maxOutputTokens: 4096,
        keyword: '개모차',
        reviewCount: 2,
        summary: '가볍고 안정적입니다.',
        strengths: ['가벼운 무게'],
        weaknesses: ['소음'],
        complaints: ['폴딩'],
        jtbd: ['산책'],
        keywords: ['개모차'],
        sentiment: { positive: 70, neutral: 10, negative: 20 },
        promptTokens: 150,
        completionTokens: 80,
        totalTokens: 230,
        processingTimeMs: 500,
      };

      const result = await repo.save(toSave);
      expect(result.id).toBe(mockStoredRow.id);
      expect(result.analysisIdentity).toBe(mockStoredRow.analysis_identity);
      expect(result.temperature).toBe(mockStoredRow.temperature);
      expect(result.promptTokens).toBe(mockStoredRow.prompt_tokens);
    });

    it('should check if identity exists', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue(createMockQueryBuilder({ id: mockStoredRow.id })),
      } as any;

      const repo = new AIAnalysisRepository(mockSupabase);
      const isExist = await repo.exists('hash-val');
      expect(isExist).toBe(true);
    });

    it('should handle duplicate identity error', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue(createMockQueryBuilder(null, { message: 'duplicate key value violates unique constraint' })),
      } as any;

      const repo = new AIAnalysisRepository(mockSupabase);
      await expect(repo.save({} as any)).rejects.toThrow('duplicate key value violates unique constraint');
    });

    it('should find latest record by provider and keyword', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue(createMockQueryBuilder(mockStoredRow)),
      } as any;

      const repo = new AIAnalysisRepository(mockSupabase);
      const result = await repo.findLatest('gemini', '개모차');
      expect(result).not.toBeNull();
      expect(result!.keyword).toBe('개모차');
    });
  });

  // 4. Persistence Service Tests
  describe('ReviewAnalysisPersistenceService', () => {
    it('should hit cache when identity exists in database', async () => {
      const mockSupabase = {} as any;
      const repoMock = {
        findByIdentity: vi.fn().mockResolvedValue({
          ...mockStoredRow,
          analysisIdentity: 'existing-hash',
        }),
      };
      
      const analyzerMock = {
        fetchReviews: vi.fn().mockResolvedValue(mockReviews),
        analyzePreparedReviews: vi.fn(),
      } as any;

      const service = new ReviewAnalysisPersistenceService(mockSupabase, analyzerMock);
      (service as any).repository = repoMock;

      const result = await service.analyzeAndPersist('gemini', '개모차', 10);
      
      expect(result.cached).toBe(true);
      expect(result.data.analysisIdentity).toBe('existing-hash');
      expect(analyzerMock.analyzePreparedReviews).not.toHaveBeenCalled();
    });

    it('should miss cache, call AI analyzer, save to database and return cached=false', async () => {
      const mockSupabase = {} as any;
      const repoMock = {
        findByIdentity: vi.fn().mockResolvedValue(null),
        save: vi.fn().mockImplementation((toSave) => Promise.resolve({ id: 'new-uuid', ...toSave, createdAt: '2026-06-27T12:00:00Z' })),
      };
      
      const analyzerMock = {
        fetchReviews: vi.fn().mockResolvedValue(mockReviews),
        analyzePreparedReviews: vi.fn().mockResolvedValue({
          result: mockValidResponse,
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
          processingTimeMs: 400,
        }),
      } as any;

      const service = new ReviewAnalysisPersistenceService(mockSupabase, analyzerMock);
      (service as any).repository = repoMock;

      const result = await service.analyzeAndPersist('gemini', '개모차', 10);

      expect(result.cached).toBe(false);
      expect(result.data.id).toBe('new-uuid');
      expect(analyzerMock.analyzePreparedReviews).toHaveBeenCalledTimes(1);
      expect(repoMock.save).toHaveBeenCalledTimes(1);
    });
  });

  // 5. API E2E Mock Tests
  describe('API Endpoints integration', () => {
    let app: any;
    let token: string;

    beforeEach(async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(mockValidResponse) }] } }],
        }),
      });
      vi.stubGlobal('fetch', mockFetch);
      app = await createApp();
      token = jwt.sign(
        { userId: 'test-user-id', email: 'test@example.com', role: 'ADMIN' },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    afterEach(async () => {
      await app.close();
    });

    it('should fetch analysis by ID successfully via GET /api/v1/reviews/analysis/:id', async () => {
      const targetId = '550e8400-e29b-41d4-a716-446655440000';
      app.supabase.from = vi.fn().mockReturnValue(createMockQueryBuilder(mockStoredRow));

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/reviews/analysis/${targetId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(targetId);
    });

    it('should throw NotFoundError if analysis ID not found via GET /api/v1/reviews/analysis/:id', async () => {
      const missingId = '00000000-0000-0000-0000-000000000000';
      app.supabase.from = vi.fn().mockReturnValue(createMockQueryBuilder(null));

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/reviews/analysis/${missingId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('not found');
    });

    it('should validate params on GET /api/v1/reviews/analysis/:id and throw 400 if not UUID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/analysis/invalid-uuid-format',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('should return latest analysis via GET /api/v1/reviews/analysis', async () => {
      app.supabase.from = vi.fn().mockReturnValue(createMockQueryBuilder(mockStoredRow));

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/analysis?provider=gemini&keyword=개모차',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.keyword).toBe('개모차');
    });

    it('should throw 400 on GET /api/v1/reviews/analysis with missing query params', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/analysis?provider=gemini',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should perform POST /api/v1/reviews/analyze, handle Cache Miss, AI Call and save', async () => {
      let lookupCalled = false;
      app.supabase.from = vi.fn().mockImplementation((table: string) => {
        if (table === 'customer_reviews') {
          return createMockQueryBuilder(mockReviews);
        }
        if (table === 'review_analysis_results') {
          if (!lookupCalled) {
            lookupCalled = true;
            return createMockQueryBuilder(null);
          }
          return createMockQueryBuilder(mockStoredRow);
        }
        return createMockQueryBuilder(null);
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/analyze',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          provider: 'gemini',
          keyword: '개모차',
          maxReviews: 2,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.cached).toBe(false);
    });
  });
});
