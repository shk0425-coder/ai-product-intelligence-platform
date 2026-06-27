import { describe, it, expect, vi } from 'vitest';
import {
  buildPrompt,
  getJsonSchemaString,
  parseResponse,
  validateResult,
  JTBDAnalysisService,
  JTBDAnalysisInput,
  JTBDAnalysisResult,
  MAX_REVIEWS,
} from '../src/modules/jtbd/index.js';
import { AIProvider, AIRequestOptions } from '../src/modules/ai/types.js';

// Mock Input Data
const mockInput: JTBDAnalysisInput = {
  productName: '친환경 텀블러',
  keyword: '텀블러',
  reviews: [
    { raw_text: '보온 성능이 뛰어나고 세척이 편해요.', rating: 5, collected_at: '2026-06-27T00:00:00Z' },
    { raw_text: '고무 패킹에서 냄새가 좀 나요.', rating: 3, collected_at: '2026-06-27T01:00:00Z' },
  ],
  aiAnalysisResult: {
    summary: '친환경 텀블러에 대한 고객 의견은 보온성과 위생성에 만족하는 반면, 고무 부품 냄새에 불만이 있음.',
    strengths: ['우수한 보온 성능', '쉬운 세척 구조'],
    weaknesses: ['고무 패킹 냄새'],
    complaints: ['패킹 냄새 개선 요망'],
    jtbd: ['사무실에서 음료를 하루 종일 따뜻하게 보관하기 위해 구매함'],
    keywords: ['텀블러', '보온', '세척'],
    sentiment: {
      positive_ratio: 70,
      negative_ratio: 30,
      neutral_ratio: 0,
    },
  },
};

// Mock Output Data (Valid JSON)
const mockValidOutput: JTBDAnalysisResult = {
  jtbd: [
    {
      situation: '사무실에서 업무 중 음료가 빠르게 식음',
      coreJob: '장시간 따뜻한 온도를 유지하여 음료를 즐김',
      emotionalOutcome: '편안함과 만족스러운 업무 몰입 환경 조성',
    },
  ],
  painPoints: [
    {
      category: '위생/위생물질',
      description: '실리콘 고무 패킹에서 유입되는 초기 고무 냄새',
      severity: 'MEDIUM',
    },
  ],
  desiredOutcomes: [
    {
      outcome: '완벽한 냄새 차단 및 위생적인 사용',
      priority: 'HIGH',
    },
  ],
  purchaseMotivation: [
    {
      trigger: '지속 가능한 소비 지향 및 일회용 컵 사용 감소 목적',
      expectedBenefit: '환경 보호 기여 및 환경 호르몬 걱정 제거',
    },
  ],
  purchaseBarrier: [
    {
      barrier: '고무 패킹의 냄새로 인한 초기 거부감',
      mitigationFactor: '첫 사용 전 식초 및 베이킹 소다 세척 팁 제공',
    },
  ],
  usageContext: [
    {
      where: '사무실 데스크',
      when: '일과 시간 내 상시',
      how: '빨대 없이 뚜껑을 열어 직접 마심',
    },
  ],
  customerSegments: [
    {
      segmentName: '직장인 친환경 지향군',
      characteristics: ['텀블러 휴대 일상화', '미니멀한 디자인 선호'],
    },
  ],
  unexpectedInsights: [
    {
      insight: '세척 편의성이 높은 구조가 텀블러 재사용 빈도를 비약적으로 높임',
      implication: '추후 개발 시 내부 라운드 처리로 사각지대 없는 세척 구조 적용 고려',
    },
  ],
};

describe('JTBD Information Extraction Prompt Engine Spec', () => {
  // 1. Prompt Spec Tests
  describe('Prompt Spec', () => {
    it('should generate identical prompt for 100 iterations with the same input', () => {
      const originalPrompt = buildPrompt(mockInput);
      expect(originalPrompt).toContain('친환경 텀블러');
      expect(originalPrompt).toContain('보온 성능이 뛰어나고 세척이 편해요');

      for (let i = 0; i < 100; i++) {
        const iterationPrompt = buildPrompt(mockInput);
        expect(iterationPrompt).toBe(originalPrompt);
      }
    });
  });

  // 2. Schema Spec Tests
  describe('Schema Spec', () => {
    it('should verify prompt jsonSchema aligns with validator definition schema', () => {
      const prompt = buildPrompt(mockInput);
      const jsonSchemaString = getJsonSchemaString();

      // 프롬프트 내부에 schema 정의가 일치하여 포함되는지 확인
      expect(prompt).toContain(jsonSchemaString);

      // JSON Schema의 최상위 스키마 속성들 검사
      const parsedSchema = JSON.parse(jsonSchemaString);
      expect(parsedSchema.$schema).toBeDefined();
      expect(parsedSchema.properties.jtbd).toBeDefined();
      expect(parsedSchema.properties.painPoints).toBeDefined();
      expect(parsedSchema.properties.desiredOutcomes).toBeDefined();
      expect(parsedSchema.required).toContain('jtbd');
      expect(parsedSchema.required).toContain('painPoints');
    });
  });

  // 3. Parser Spec Tests
  describe('Parser Spec', () => {
    it('should parse normal valid JSON string', () => {
      const raw = JSON.stringify(mockValidOutput);
      const parsed = parseResponse(raw);
      expect(parsed).toEqual(mockValidOutput);
    });

    it('should parse markdown JSON block with ```json syntax', () => {
      const raw = `
Some introduction texts here...
\`\`\`json
${JSON.stringify(mockValidOutput)}
\`\`\`
Ending explanatory texts.`;
      const parsed = parseResponse(raw);
      expect(parsed).toEqual(mockValidOutput);
    });

    it('should parse markdown block with simple \`\`\` syntax', () => {
      const raw = `
\`\`\`
${JSON.stringify(mockValidOutput)}
\`\`\`
`;
      const parsed = parseResponse(raw);
      expect(parsed).toEqual(mockValidOutput);
    });

    it('should parse json surrounded by natural language description', () => {
      const raw = `Here is your requested output: ${JSON.stringify(mockValidOutput)} Hope this helps!`;
      const parsed = parseResponse(raw);
      expect(parsed).toEqual(mockValidOutput);
    });

    it('should throw error when parsing invalid json structure', () => {
      const raw = '{"jtbd": [invalid-json}';
      expect(() => parseResponse(raw)).toThrow();
    });
  });

  // 4. Validator Spec Tests
  describe('Validator Spec', () => {
    it('should validate normal valid parsed data successfully', () => {
      const result = validateResult(mockValidOutput);
      expect(result).toEqual(mockValidOutput);
    });

    it('should throw error when required fields are missing', () => {
      const missingJtbd = { ...mockValidOutput };
      // @ts-expect-error - testing invalid object structure
      delete missingJtbd.jtbd;

      expect(() => validateResult(missingJtbd)).toThrow('JTBD Schema Validation Failed: [jtbd]: Required');
    });

    it('should throw error when unknown fields are present (strict check)', () => {
      const unknownFieldObj = {
        ...mockValidOutput,
        unexpectedKey: 'unallowed-value',
      };

      expect(() => validateResult(unknownFieldObj)).toThrow('JTBD Schema Validation Failed: [root]: Unrecognized key(s) in object');
    });

    it('should throw error when enum value is invalid', () => {
      const invalidEnumObj = JSON.parse(JSON.stringify(mockValidOutput));
      invalidEnumObj.painPoints[0].severity = 'VERY_HIGH'; // HIGH/MEDIUM/LOW 만 허용

      expect(() => validateResult(invalidEnumObj)).toThrow('[painPoints.0.severity]: Invalid enum value');
    });

    it('should throw error when value type is invalid', () => {
      const invalidTypeObj = JSON.parse(JSON.stringify(mockValidOutput));
      invalidTypeObj.painPoints[0].category = 12345; // string 이어야 함

      expect(() => validateResult(invalidTypeObj)).toThrow('[painPoints.0.category]: Expected string, received number');
    });

    it('should throw error when null is provided', () => {
      const nullFieldObj = JSON.parse(JSON.stringify(mockValidOutput));
      nullFieldObj.painPoints[0].category = null;

      expect(() => validateResult(nullFieldObj)).toThrow('[painPoints.0.category]: Expected string, received null');
    });

    it('should throw error when undefined is provided', () => {
      const undefinedFieldObj = JSON.parse(JSON.stringify(mockValidOutput));
      undefinedFieldObj.painPoints[0].category = undefined;

      expect(() => validateResult(undefinedFieldObj)).toThrow('[painPoints.0.category]: Required');
    });

    it('should throw error when empty string is provided', () => {
      const emptyStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      emptyStringObj.painPoints[0].category = '';

      expect(() => validateResult(emptyStringObj)).toThrow('[painPoints.0.category]: String must contain at least 1 character(s)');
    });

    it('should throw error when string exceeds max limit', () => {
      const longStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      longStringObj.painPoints[0].description = 'a'.repeat(501); // max 500

      expect(() => validateResult(longStringObj)).toThrow('[painPoints.0.description]: String must contain at most 500 character(s)');
    });
  });

  // 5. Service Spec Tests
  describe('Service Spec', () => {
    it('should orchestrate prompt generation, AI provider invocation, response parsing and validation successfully', async () => {
      // Setup Mock AI Provider
      const mockAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue(JSON.stringify(mockValidOutput)),
        getName: () => 'Mock Gemini Provider',
      };

      const service = new JTBDAnalysisService(mockAIProvider);
      const result = await service.analyze(mockInput);

      expect(result).toEqual(mockValidOutput);
      expect(mockAIProvider.analyze).toHaveBeenCalledTimes(1);

      // Verify request options passed to provider
      const passedPrompt = (mockAIProvider.analyze as any).mock.calls[0][0];
      const passedOptions: AIRequestOptions = (mockAIProvider.analyze as any).mock.calls[0][1];

      expect(passedPrompt).toContain('친환경 텀블러');
      expect(passedOptions.temperature).toBe(0.2);
      expect(passedOptions.maxOutputTokens).toBe(4096);
    });

    it('should pass options parameters to AI request options when customized options are provided', async () => {
      const mockAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue(JSON.stringify(mockValidOutput)),
        getName: () => 'Mock Gemini Provider',
      };

      const service = new JTBDAnalysisService(mockAIProvider);
      const customOptions = {
        model: 'custom-model-pro',
        temperature: 0.8,
        maxOutputTokens: 2048,
        timeout: 15000,
      };
      
      const result = await service.analyze(mockInput, customOptions);
      expect(result).toEqual(mockValidOutput);
      expect(mockAIProvider.analyze).toHaveBeenCalledTimes(1);

      const passedOptions: AIRequestOptions = (mockAIProvider.analyze as any).mock.calls[0][1];
      expect(passedOptions.model).toBe('custom-model-pro');
      expect(passedOptions.temperature).toBe(0.8);
      expect(passedOptions.maxOutputTokens).toBe(2048);
      expect(passedOptions.timeout).toBe(15000);
    });

    it('should propagate validation errors when AI response fails schema requirements', async () => {
      const mockInvalidAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue('{"jtbd": []}'), // required fields missing
        getName: () => 'Mock Gemini Provider',
      };

      const service = new JTBDAnalysisService(mockInvalidAIProvider);
      await expect(service.analyze(mockInput)).rejects.toThrow('JTBD Schema Validation Failed');
      expect(mockInvalidAIProvider.analyze).toHaveBeenCalledTimes(1);
    });
  });
});
