import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PromptBuilder } from '../src/modules/ai/prompt-builder.js';
import { TokenManager } from '../src/modules/ai/token-manager.js';
import { ResponseParser } from '../src/modules/ai/parser.js';
import { AIValidator } from '../src/modules/ai/validator.js';
import { GeminiProvider } from '../src/modules/ai/providers/gemini.provider.js';
import { ReviewAnalyzerService } from '../src/modules/ai/service.js';
import { createApp } from '../src/app.js';
import jwt from 'jsonwebtoken';

const mockReviews = [
  { raw_text: '바퀴 조작이 편하고 정말 가볍네요.', rating: 5, collected_at: '2026-06-27T12:00:00Z' },
  { raw_text: '접는 법이 조금 어렵지만 안정감은 뛰어납니다.', rating: 4, collected_at: '2026-06-27T11:00:00Z' },
  { raw_text: '바퀴 휠에서 소리가 나서 아쉬워요.', rating: 2, collected_at: '2026-06-27T10:00:00Z' },
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
  review_count: 3,
  summary: '가볍고 안정적이나 바퀴 소음이 아쉽다는 평가입니다.',
  strengths: ['가벼운 무게', '우수한 주행감'],
  weaknesses: ['바퀴 유격 소음'],
  complaints: ['접이 폴딩 어려움'],
  jtbd: ['강아지와 편안한 야외 산책'],
  keywords: ['개모차', '바퀴'],
  sentiment: { positive: 70, neutral: 10, negative: 20 },
  prompt_tokens: 150,
  completion_tokens: 80,
  total_tokens: 230,
  processing_time_ms: 500,
  created_at: '2026-06-27T12:00:00Z',
};

function createMockQueryBuilder(data: any, error: any = null) {
  const qb: any = {};
  const methods = ['select', 'order', 'ilike', 'limit', 'insert', 'eq', 'maybeSingle', 'single'];
  for (const m of methods) {
    qb[m] = vi.fn().mockImplementation(() => qb);
  }
  qb.then = (onfulfilled: any) => Promise.resolve({ data, error }).then(onfulfilled);
  return qb;
}

describe('AI Review Analysis Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('PromptBuilder', () => {
    it('should compile a structured prompt containing schema, keyword, and merged reviews', () => {
      const prompt = PromptBuilder.build(mockReviews, '개모차');
      expect(prompt).toContain('[Role]');
      expect(prompt).toContain('[Task]');
      expect(prompt).toContain('[Rules]');
      expect(prompt).toContain('[Output JSON Schema]');
      expect(prompt).toContain('[Review Data]');
      expect(prompt).toContain('개모차');
      expect(prompt).toContain('바퀴 조작이 편하고 정말 가볍네요.');
      expect(prompt).toContain('접는 법이 조금 어렵지만');
    });
  });

  describe('TokenManager', () => {
    it('should calculate estimated token count', () => {
      const text = 'Hello world';
      const tokens = TokenManager.estimateTokens(text);
      expect(tokens).toBe(Math.ceil(text.length / 3));
    });

    it('should truncate reviews when they exceed max token budget keeping newest first', () => {
      const truncated = TokenManager.truncateReviews(mockReviews, 450, '개모차');
      expect(truncated.length).toBeLessThanOrEqual(mockReviews.length);
    });
  });

  describe('ResponseParser', () => {
    it('should extract raw JSON from code blocks or raw text', () => {
      const rawText = '```json\n{"key": "value"}\n```';
      const result = ResponseParser.parse(rawText);
      expect(result).toEqual({ key: 'value' });
    });

    it('should strip markdown indicators correctly', () => {
      const rawText = '```\n{"foo": "bar"}\n```';
      const result = ResponseParser.parse(rawText);
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should throw an error on invalid json structure', () => {
      const rawText = '{"invalid json';
      expect(() => ResponseParser.parse(rawText)).toThrow('Failed to parse AI response JSON');
    });
  });

  describe('AIValidator', () => {
    it('should validate valid schema data successfully', () => {
      const validated = AIValidator.validate(mockValidResponse);
      expect(validated).toEqual(mockValidResponse);
    });

    it('should throw error on missing schema properties', () => {
      const invalid = { ...mockValidResponse, strengths: undefined };
      expect(() => AIValidator.validate(invalid)).toThrow('Zod validation failed');
    });

    it('should throw error on business validation failure: empty summary', () => {
      const invalid = { ...mockValidResponse, summary: '' };
      expect(() => AIValidator.validate(invalid)).toThrow('Business validation failed: summary cannot be empty');
    });

    it('should throw error on business validation failure: sentiment sum not 100', () => {
      const invalid = {
        ...mockValidResponse,
        sentiment: { positive: 50, neutral: 10, negative: 10 },
      };
      expect(() => AIValidator.validate(invalid)).toThrow('sentiment total sum must equal 100');
    });
  });

  describe('GeminiProvider', () => {
    it('should request API with appropriate payload and return text', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '{"response": "ok"}' }] } }],
        }),
      });
      global.fetch = mockFetch;

      const provider = new GeminiProvider('test-key');
      const response = await provider.analyze('test prompt', {
        model: 'gemini-1.5-flash',
        temperature: 0.2,
        timeout: 1000,
        maxOutputTokens: 200,
        promptVersion: 'v1',
      });

      expect(response).toBe('{"response": "ok"}');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry up to 2 times on retryable errors (429/500/503) and succeed if recovered', async () => {
      let callCount = 0;
      const mockFetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount < 3) {
          return { status: 500 };
        }
        return {
          status: 200,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'recovered success' }] } }],
          }),
        };
      });
      global.fetch = mockFetch;

      const provider = new GeminiProvider('test-key');
      const response = await provider.analyze('test prompt', {
        model: 'gemini-1.5-flash',
        temperature: 0.2,
        timeout: 1000,
        maxOutputTokens: 200,
        promptVersion: 'v1',
      });

      expect(response).toBe('recovered success');
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('ReviewAnalyzerService', () => {
    it('should execute full analysis pipeline successfully', async () => {
      const mockSupabase = {
        from: vi.fn().mockImplementation(() => createMockQueryBuilder(mockReviews)),
      } as any;

      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(mockValidResponse) }] } }],
        }),
      });
      global.fetch = mockFetch;

      const service = new ReviewAnalyzerService(mockSupabase);
      const result = await service.analyzeReviews('gemini', '개모차', 10);

      expect(result).toEqual(mockValidResponse);
    });
  });

  describe('API Analyze Route Integration', () => {
    let app: any;
    let validToken: string;

    beforeEach(async () => {
      app = await createApp();
      validToken = jwt.sign(
        { userId: '11111111-1111-1111-1111-111111111111', role: 'USER' },
        process.env.JWT_SECRET || 'test-jwt-secret-min-32-characters-long'
      );
    });

    afterEach(async () => {
      await app.close();
    });

    it('should respond 200 on successful review analysis', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify(mockValidResponse) }] } }],
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      vi.spyOn(app.supabase, 'from').mockImplementation((table: string) => {
        if (table === 'customer_reviews') {
          return createMockQueryBuilder(mockReviews);
        }
        if (table === 'review_analysis_results') {
          return createMockQueryBuilder(mockStoredRow);
        }
        return createMockQueryBuilder(null);
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/analyze',
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        payload: {
          provider: 'gemini',
          keyword: '개모차',
          maxReviews: 50,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.data.summary).toBe(mockValidResponse.summary);
      expect(body.data.sentiment).toEqual(mockValidResponse.sentiment);
    });

    it('should respond 400 when invalid payload is sent', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/analyze',
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        payload: {
          provider: 'invalid-provider',
          keyword: '',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
    });

    it('should respond 401 when token is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/analyze',
        payload: {
          provider: 'gemini',
          keyword: '개모차',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
