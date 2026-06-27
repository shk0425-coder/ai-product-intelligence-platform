import { describe, it, expect, vi } from 'vitest';
import {
  buildPrompt,
  getJsonSchemaString,
  parseResponse,
  validateResult,
  ProductStrategyService,
  ProductStrategyInput,
  ProductStrategyResult,
  STORYBOARD_STEPS,
} from '../src/modules/product-strategy/index.js';
import { AIProvider, AIRequestOptions } from '../src/modules/ai/types.js';

// Mock Input Data
const mockInput: ProductStrategyInput = {
  productName: '친환경 텀블러',
  keyword: '텀블러',
  aiAnalysisResult: {
    summary: '보온 성능과 친환경성에 만족하나 고무 패킹 냄새에 불만이 있음.',
    strengths: ['우수한 보온 성능', '쉬운 세척'],
    weaknesses: ['고무 패킹 냄새'],
    complaints: ['패킹 냄새 개선 요망'],
    jtbd: ['사무실에서 음료를 장시간 따뜻하게 보관'],
    keywords: ['텀블러', '보온'],
    sentiment: {
      positive: 70,
      neutral: 10,
      negative: 20,
    },
  },
  jtbdAnalysisResult: {
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
        trigger: '지속 가능한 소비 지향 및 일회용 컵 사용 감소',
        expectedBenefit: '환경 보호 기여',
      },
    ],
    purchaseBarrier: [
      {
        barrier: '고무 패킹의 냄새로 인한 초기 거부감',
        mitigationFactor: '식초 세척 가이드 제공',
      },
    ],
    usageContext: [
      {
        where: '사무실 데스크',
        when: '일과 시간 내 상시',
        how: '직접 마심',
      },
    ],
    customerSegments: [
      {
        segmentName: '직장인 친환경 지향군',
        characteristics: ['텀블러 휴대 일상화'],
      },
    ],
    unexpectedInsights: [
      {
        insight: '세척 편의성이 높은 구조가 재사용 빈도를 높임',
        implication: '세척 구조 간소화',
      },
    ],
  },
};

// Mock Output Data (Valid 8-Step Storyboard)
const mockValidOutput: ProductStrategyResult = {
  productName: '친환경 텀블러',
  keyword: '텀블러',
  storyboard: {
    steps: [
      {
        step: 1,
        type: 'Attention',
        name: 'Attention',
        title: '하루 종일 따뜻한 커피, 하지만 고무 냄새 없는 완벽한 한 모금',
        objective: '고객의 주의 집중 및 냄새 걱정 없는 청량한 보온 강조',
        customerEmotion: { current: '식어버린 커피와 고무 패킹 냄새에 짜증남', desired: '첫 입부터 안심하고 마시고 싶음' },
        customerQuestion: { question: '이 텀블러는 고무 패킹 냄새가 정말 안 나나요?', answer: '초기 특수 고온 탈취 공정으로 냄새를 완벽히 잡았습니다.' },
        sellingPoint: { hook: '더 이상 고무 냄새가 섞인 커피를 마시지 마세요', description: '의료용 청정 실리콘 도입으로 첫 개봉 시에도 유해 고무 냄새 0%' },
        recommendedContent: { visualLayout: '상단 텀블러 클로즈업 컷과 냄새 분자를 상징하는 그래픽 대조 레이아웃', copywriting: ['보온력은 기본, 냄새까지 잡은 단 하나의 친환경 선택'] },
      },
      {
        step: 2,
        type: 'Problem',
        name: 'Problem',
        title: '커피 한 모금에 섞여오는 불쾌한 실리콘 고무 냄새',
        objective: '초기 세척으로도 잘 지워지지 않는 냄새 불편 공감',
        customerEmotion: { current: '세척을 해도 패킹 냄새가 가시지 않아 답답함', desired: '세척 팁이나 냄새 없는 원료를 원함' },
        customerQuestion: { question: '왜 다른 텀블러는 초기 고무 냄새가 심한가요?', answer: '저가형 산업 실리콘 가공 시 발생하는 잔여 휘발성 유기화합물 때문입니다.' },
        sellingPoint: { hook: '화학 세척제로도 해결되지 않던 냄새의 원인', description: '냄새뿐만 아니라 보온 텀블러 사용의 근본적인 쾌적함을 저해하는 실리콘 불순물 규명' },
        recommendedContent: { visualLayout: '답답하게 인상을 찌푸리며 마시는 직장인의 데스크 연출 컷', copywriting: ['베이킹소다에 식초까지 동원해도 가시지 않는 그 냄새, 왜일까요?'] },
      },
      {
        step: 3,
        type: 'Empathy',
        name: 'Empathy',
        title: '친환경을 위한 텀블러, 오히려 스트레스가 된다면?',
        objective: '일회용 컵을 줄이려는 좋은 취지가 스트레스로 다가오는 상황 교감',
        customerEmotion: { current: '좋은 취지로 산 텀블러에 손이 가지 않아 자책감', desired: '스트레스 없는 가벼운 텀블러 사용 일상화' },
        customerQuestion: { question: '다른 사람들도 똑같은 스트레스를 겪나요?', answer: '수집 리뷰 분석 결과 70% 이상의 사용자가 패킹 냄새와 복잡한 세척에 피로감을 호소했습니다.' },
        sellingPoint: { hook: '친환경 실천의 첫 단계는 즐거움이어야 하기에', description: '사무실 데스크에서 언제든 기분 좋게 텀블러를 꺼낼 수 있는 청결 만족감 선사' },
        recommendedContent: { visualLayout: '데스크에 방치된 먼지 쌓인 옛 텀블러들과 새로 준비된 청량한 이미지 대조', copywriting: ['서랍 구석으로 가버린 수많은 텀블러, 이제 청결한 정답으로 바꿀 차례'] },
      },
      {
        step: 4,
        type: 'Solution',
        name: 'Solution',
        title: '냄새 원천 차단 의료용 청정 실리콘 & 간편 라운드 세척 구조',
        objective: '제품의 하이테크 소재 및 사각지대 없는 위생 설계 제공',
        customerEmotion: { current: '이 텀블러라면 안심하고 마실 수 있을 것 같아 기대됨', desired: '검증된 무취 성능 확인' },
        customerQuestion: { question: '의료용 실리콘과 일반 실리콘은 어떻게 다른가요?', answer: '인체에 무해한 액상 주입형 실리콘(LSR) 기법을 사용해 고온 유해 물질 발산과 무취를 반영구 보장합니다.' },
        sellingPoint: { hook: '처음 쓰는 날 바로 느끼는 무취 청정 기술', description: '내부 모서리를 직각이 아닌 라운드로 깎아 수세미가 끝까지 닿아 간편한 세척 구현' },
        recommendedContent: { visualLayout: '라운드 처리된 바닥면 구조 단면도와 텀블러 부품 분해 3D 렌더링', copywriting: ['의료용 안심 실리콘으로 냄새 0, 흐르는 물로 3초 만에 씻는 완벽 세척 구조'] },
      },
      {
        step: 5,
        type: 'Differentiation',
        name: 'Differentiation',
        title: '비교해보세요: 화학 코팅 없는 순수 내벽 설계',
        objective: '경쟁사 제품 대비 화학 마감재 미사용 및 장기 위생성 우위 입증',
        customerEmotion: { current: '타사 보온 텀블러의 화학 유해 코팅이 불안함', desired: '안전성이 입증된 절대적 차별점 확인' },
        customerQuestion: { question: '코팅이 없으면 보온력이 떨어지거나 녹이 슬지 않나요?', answer: '최고 등급 포스코 SUS 316L 스테인리스를 도입해 코팅 없이도 부식과 냄새 흡착을 방지합니다.' },
        sellingPoint: { hook: '코팅 벗겨짐 걱정 없는 평생 안심 텀블러', description: '유해 화학 물질 검출 테스트 성적서 100% 통과로 입증된 타사 압도 우위성' },
        recommendedContent: { visualLayout: '타사 일반 텀블러 vs 본사 무코팅 텀블러의 1년 사용 후 내벽 확대 비교표', copywriting: ['유해 코팅 물질 zero. 평생 쓸 수 있는 포스코 안심 스테인리스 316L'] },
      },
      {
        step: 6,
        type: 'Trust',
        name: 'Trust',
        title: '직장인 1,500명이 증명하는 보온 및 냄새 개선 리포트',
        objective: '실제 체험단 리뷰 점수 및 시험 성적서 공신력 획득',
        customerEmotion: { current: '광고 문구가 실제인지 확인하고 싶음', desired: '검증된 후기와 데이터로 안심함' },
        customerQuestion: { question: '실제 사용자들의 평가는 어떤가요?', answer: '사용자 평점 4.9/5.0을 기록했으며, 특히 고무 냄새와 세척성 항목에서 99% 긍정 피드백을 받았습니다.' },
        sellingPoint: { hook: '과장 광고가 아닌 공인 성적서와 실구매자 평점', description: 'FDA 승인, KCL 유해성분 미검출 시험 성적서 실물 이미지 제시' },
        recommendedContent: { visualLayout: 'FDA, KCL 성적서 인증서 엠블럼과 긍정 리뷰 롤링 보드 배치', copywriting: ['인증받은 유해 성분 무검출 결과와 직장인들의 평점 4.9가 증명합니다'] },
      },
      {
        step: 7,
        type: 'Offer',
        name: 'Offer',
        title: '첫 구매 한정: 식초/베이킹 세척 파우더 무료 증정 구성',
        objective: '첫 고무 냄새 및 관리에 민감한 초기 구매자용 세척 패키지 오퍼 제공',
        customerEmotion: { current: '구매하고 싶으나 가격 저항이나 텀블러 세정제 비용이 망설여짐', desired: '전용 클리너까지 포함된 혜택 수령' },
        customerQuestion: { question: '세척 파우더는 어떻게 사용하나요?', answer: '첫 사용 시 미온수에 파우더 한 포를 녹여 10분 후 헹구어 주시면 완벽한 무취 관리가 가능합니다.' },
        sellingPoint: { hook: '오직 오늘만 드리는 직장인 청결 스타터 패키지', description: '텀블러 본체 + 무독성 발포 세정 파우더 10팩 단독 세트 구성' },
        recommendedContent: { visualLayout: '본품과 클리너 패키지가 고급스럽게 정렬된 선물 상자 구도의 스틸컷', copywriting: ['첫 사용부터 완벽하게, 텀블러 발포 클리너 파우더 무료 구성 패키지'] },
      },
      {
        step: 8,
        type: 'CTA',
        name: 'CTA',
        title: '지속 가능한 직장 생활, 오늘부터 냄새 없는 안심 텀블러와 함께',
        objective: '즉각적인 구매 결심 유도 및 무료 교환/환불 안심 보장 제공',
        customerEmotion: { current: '써보고 마음에 들지 않으면 어쩌나 걱정됨', desired: '무료 환불 정책을 믿고 즉시 결제' },
        customerQuestion: { question: '진짜 냄새가 나면 환불해 주나요?', answer: '네, 수령 후 고무 냄새가 가시지 않는다면 7일 이내 100% 전액 환불을 보장합니다.' },
        sellingPoint: { hook: '냄새 불만족 시 100% 환불, 그만큼 자신 있습니다', description: '소량 생산 완판 임박, 망설임은 배송을 늦출 뿐입니다' },
        recommendedContent: { visualLayout: '눈에 띄는 안심 환불 보증 마크 배너와 형광빛 구매 버튼', copywriting: ['구매하기 (냄새 불만족 시 100% 무료 반품 보장)'] },
        cta: {
          buttonText: '냄새 없는 텀블러 즉시 구매하기',
          actionUrlPlaceholder: '/products/ecotub/buy',
        },
      },
    ],
  },
};

describe('Product Strategy Storyboard Builder Spec', () => {
  // 1. Prompt Spec Tests
  describe('Prompt Spec', () => {
    it('should generate identical prompt for 100 iterations with the same input', () => {
      const originalPrompt = buildPrompt(mockInput);
      expect(originalPrompt).toContain('친환경 텀블러');
      expect(originalPrompt).toContain('고무 패킹 냄새');

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

      // 프롬프트 내부에 schema 정의가 들어있어야 함
      expect(prompt).toContain(jsonSchemaString);

      // 최상위 schema properties 검사
      const parsedSchema = JSON.parse(jsonSchemaString);
      expect(parsedSchema.properties.productName).toBeDefined();
      expect(parsedSchema.properties.keyword).toBeDefined();
      expect(parsedSchema.properties.storyboard).toBeDefined();
      expect(parsedSchema.required).toContain('productName');
      expect(parsedSchema.required).toContain('storyboard');
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

    it('should parse JSON surrounded by natural language description', () => {
      const raw = `Here is your requested output: ${JSON.stringify(mockValidOutput)} Hope this helps!`;
      const parsed = parseResponse(raw);
      expect(parsed).toEqual(mockValidOutput);
    });

    it('should throw error when parsing invalid json structure', () => {
      const raw = '{"storyboard": [invalid-json}';
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
      const missingName = { ...mockValidOutput };
      // @ts-expect-error - testing invalid object structure
      delete missingName.productName;

      expect(() => validateResult(missingName)).toThrow('Product Strategy Schema Validation Failed: [productName]: Required');
    });

    it('should throw error when unknown fields are present (strict check)', () => {
      const unknownFieldObj = {
        ...mockValidOutput,
        unexpectedKey: 'unallowed-value',
      };

      expect(() => validateResult(unknownFieldObj)).toThrow('Product Strategy Schema Validation Failed: [root]: Unrecognized key(s) in object');
    });

    it('should throw error when step size is not exactly 8', () => {
      const invalidSizeObj = JSON.parse(JSON.stringify(mockValidOutput));
      invalidSizeObj.storyboard.steps.pop(); // 7개로 축소

      expect(() => validateResult(invalidSizeObj)).toThrow('Product Strategy Storyboard Validation Failed: Steps count must be exactly 8');
    });

    it('should throw error when step order is mismatched', () => {
      const mismatchedOrderObj = JSON.parse(JSON.stringify(mockValidOutput));
      mismatchedOrderObj.storyboard.steps[1].step = 3; // step 2의 번호를 3으로 오염

      expect(() => validateResult(mismatchedOrderObj)).toThrow('Product Strategy Storyboard Validation Failed: Step order mismatch at index 1');
    });

    it('should throw error when step type is mismatched', () => {
      const mismatchedTypeObj = JSON.parse(JSON.stringify(mockValidOutput));
      mismatchedTypeObj.storyboard.steps[1].type = 'Attention'; // step 2의 type을 Attention으로 오염

      expect(() => validateResult(mismatchedTypeObj)).toThrow("Product Strategy Storyboard Validation Failed: Step type mismatch at step 2. Expected type 'Problem', got 'Attention'");
    });

    it('should throw error when step name is mismatched', () => {
      const mismatchedNameObj = JSON.parse(JSON.stringify(mockValidOutput));
      mismatchedNameObj.storyboard.steps[1].name = 'ProblemMismatch'; // step 2의 name 오염

      expect(() => validateResult(mismatchedNameObj)).toThrow("Product Strategy Storyboard Validation Failed: Step name mismatch at step 2. Expected name 'Problem', got 'ProblemMismatch'");
    });

    it('should throw error when null is provided', () => {
      const nullFieldObj = JSON.parse(JSON.stringify(mockValidOutput));
      nullFieldObj.storyboard.steps[0].title = null;

      expect(() => validateResult(nullFieldObj)).toThrow('[storyboard.steps.0.title]: Expected string, received null');
    });

    it('should throw error when empty string is provided', () => {
      const emptyStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      emptyStringObj.storyboard.steps[0].title = '';

      expect(() => validateResult(emptyStringObj)).toThrow('[storyboard.steps.0.title]: String must contain at least 1 character(s)');
    });

    it('should throw error when string exceeds max limit', () => {
      const longStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      longStringObj.storyboard.steps[0].title = 'a'.repeat(501); // max 500

      expect(() => validateResult(longStringObj)).toThrow('[storyboard.steps.0.title]: String must contain at most 500 character(s)');
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

      const service = new ProductStrategyService(mockAIProvider);
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

      const service = new ProductStrategyService(mockAIProvider);
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
        analyze: vi.fn().mockResolvedValue('{"productName": "test", "storyboard": {"steps": []}}'), // required fields missing
        getName: () => 'Mock Gemini Provider',
      };

      const service = new ProductStrategyService(mockInvalidAIProvider);
      await expect(service.analyze(mockInput)).rejects.toThrow();
      expect(mockInvalidAIProvider.analyze).toHaveBeenCalledTimes(1);
    });
  });
});
