import { describe, it, expect, vi } from 'vitest';
import {
  buildPrompt,
  getJsonSchemaString,
  parseResponse,
  validateResult,
  CreativeService,
  FluxImageProvider,
  CreativeInput,
  CreativeResult,
  STORYBOARD_STEPS,
} from '../src/modules/creative/index.js';
import { AIProvider, AIRequestOptions } from '../src/modules/ai/types.js';

// Mock Input Data
const mockInput: CreativeInput = {
  productName: '친환경 텀블러',
  keyword: '텀블러',
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
  productStrategyResult: {
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
  },
};

// Mock Output Data (Valid 8-Step Creative Result)
const mockValidOutput: CreativeResult = {
  productName: '친환경 텀블러',
  keyword: '텀블러',
  scenes: [
    {
      step: 1,
      name: 'Attention',
      title: '하루 종일 따뜻한 커피, 하지만 고무 냄새 없는 완벽한 한 모금',
      imagePrompt: 'Professional commercial studio photo of a clean Eco-friendly tumbler on a wooden desk, steam rising gently, bright lighting, high-end design.',
      negativePrompt: 'blurry, text, watermark, logo, low quality, cheap plastic',
      style: { styleName: 'Studio Commercial', elements: ['High-end lighting', 'Minimal background'] },
      composition: { focus: 'Tumbler in center', ruleOfThirds: true },
      cameraAngle: { angle: 'Eye level', shotType: 'Close-up' },
      lighting: { type: 'Soft studio lighting', mood: 'Clean and fresh' },
    },
    {
      step: 2,
      name: 'Problem',
      title: '커피 한 모금에 섞여오는 불쾌한 실리콘 고무 냄새',
      imagePrompt: 'Close-up shot of a dirty industrial silicone ring, dark moody background, high contrast, emphasizing impurities.',
      negativePrompt: 'blurry, text, watermark, logo, bright, happy, warm',
      style: { styleName: 'Moody Editorial', elements: ['High contrast', 'Cool color palette'] },
      composition: { focus: 'Silicone ring details', ruleOfThirds: false },
      cameraAngle: { angle: 'Macro close-up', shotType: 'Detail shot' },
      lighting: { type: 'Dramatic key light', mood: 'Serious and warning' },
    },
    {
      step: 3,
      name: 'Empathy',
      title: '친환경을 위한 텀블러, 오히려 스트레스가 된다면?',
      imagePrompt: 'A frustrated office worker sitting at a desk, looking at an old unused tumbler with disappointment, soft overhead lighting.',
      negativePrompt: 'blurry, happy, smiling, watermark, text',
      style: { styleName: 'Lifestyle Portrait', elements: ['Soft focus', 'Natural elements'] },
      composition: { focus: 'Frustrated office worker', ruleOfThirds: true },
      cameraAngle: { angle: 'Slightly high angle', shotType: 'Medium shot' },
      lighting: { type: 'Natural ambient light', mood: 'Melancholic and empathetic' },
    },
    {
      step: 4,
      name: 'Solution',
      title: '냄새 원천 차단 의료용 청정 실리콘 & 간편 라운드 세척 구조',
      imagePrompt: '3D product visualization showing the medical-grade liquid silicone ring and seamless rounded bottom inner chamber, pristine white background.',
      negativePrompt: 'blurry, raw, unedited, dirty, shadows',
      style: { styleName: '3D Render Diagram', elements: ['Pristine white', 'Technical line outlines'] },
      composition: { focus: 'Seamless round corner chamber', ruleOfThirds: false },
      cameraAngle: { angle: 'Cutaway view', shotType: 'Technical macro' },
      lighting: { type: 'Even studio lighting', mood: 'Trustworthy and technological' },
    },
    {
      step: 5,
      name: 'Differentiation',
      title: '비교해보세요: 화학 코팅 없는 순수 내벽 설계',
      imagePrompt: 'Side-by-side macro photo comparing a scratched chemical coating tumbler inner vs a shiny raw stainless steel 316L inner wall.',
      negativePrompt: 'blurry, text, logo, low contrast',
      style: { styleName: 'Side-by-side Macro Comparison', elements: ['Metallic texture', 'High resolution'] },
      composition: { focus: 'Stainless steel texture vs scratched coating', ruleOfThirds: true },
      cameraAngle: { angle: 'Flat lay macro', shotType: 'Comparison shot' },
      lighting: { type: 'Specular highlights', mood: 'Scientific and premium' },
    },
    {
      step: 6,
      name: 'Trust',
      title: '직장인 1,500명이 증명하는 보온 및 냄새 개선 리포트',
      imagePrompt: 'Clean minimalist layout with certificate seals and stamps representing FDA and KCL certificates, blurred office background.',
      negativePrompt: 'blurry, unreadable text, low quality, mess',
      style: { styleName: 'Minimal Graphic Layout', elements: ['Clean shapes', 'Official emblems'] },
      composition: { focus: 'FDA certification emblem', ruleOfThirds: true },
      cameraAngle: { angle: 'Straight on', shotType: 'Flat lay' },
      lighting: { type: 'Soft diffused light', mood: 'Reliable and authoritative' },
    },
    {
      step: 7,
      name: 'Offer',
      title: '첫 구매 한정: 식초/베이킹 세척 파우더 무료 증정 구성',
      imagePrompt: 'Premium packaging design with the tumbler standing next to a box of sparkling cleaning powder packs, gift wrapping, warm festive style.',
      negativePrompt: 'blurry, cheap wrapping, low quality, text',
      style: { styleName: 'Commercial Gift Set', elements: ['Premium gift box', 'Warm tones'] },
      composition: { focus: 'Tumbler and powder pack box', ruleOfThirds: true },
      cameraAngle: { angle: 'Low angle', shotType: 'Product hero shot' },
      lighting: { type: 'Golden hour backlight', mood: 'Exciting and valuable' },
    },
    {
      step: 8,
      name: 'CTA',
      title: '지속 가능한 직장 생활, 오늘부터 냄새 없는 안심 텀블러와 함께',
      imagePrompt: 'A happy young professional smiling, holding the clean tumbler on their way to work, sunny city background, optimistic morning light.',
      negativePrompt: 'blurry, sad, dark, rainy, text, watermark',
      style: { styleName: 'Outdoor Lifestyle', elements: ['Sunny background', 'Natural smile'] },
      composition: { focus: 'Smiling professional with tumbler', ruleOfThirds: true },
      cameraAngle: { angle: 'Eye level', shotType: 'Medium close-up' },
      lighting: { type: 'Bright morning sunlight', mood: 'Optimistic and active' },
    },
  ],
};

describe('Creative Pipeline Spec', () => {
  // 1. Prompt Spec Tests
  describe('Prompt Spec', () => {
    it('should generate identical prompt for 100 iterations with the same input', () => {
      const originalPrompt = buildPrompt(mockInput);
      expect(originalPrompt).toContain('친환경 텀블러');
      expect(originalPrompt).toContain('하루 종일 따뜻한 커피');

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
      expect(parsedSchema.properties.scenes).toBeDefined();
      expect(parsedSchema.required).toContain('productName');
      expect(parsedSchema.required).toContain('scenes');
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
      const raw = '{"scenes": [invalid-json}';
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

      expect(() => validateResult(missingName)).toThrow('Creative Schema Validation Failed: [productName]: Required');
    });

    it('should throw error when unknown fields are present (strict check)', () => {
      const unknownFieldObj = {
        ...mockValidOutput,
        unexpectedKey: 'unallowed-value',
      };

      expect(() => validateResult(unknownFieldObj)).toThrow('Creative Schema Validation Failed: [root]: Unrecognized key(s) in object');
    });

    it('should throw error when scene size is not exactly 8', () => {
      const invalidSizeObj = JSON.parse(JSON.stringify(mockValidOutput));
      invalidSizeObj.scenes.pop(); // 7개로 축소

      expect(() => validateResult(invalidSizeObj)).toThrow('Creative Storyboard Scenes Validation Failed: Scenes count must be exactly 8');
    });

    it('should throw error when step order is mismatched', () => {
      const mismatchedOrderObj = JSON.parse(JSON.stringify(mockValidOutput));
      mismatchedOrderObj.scenes[1].step = 3; // step 2의 번호를 3으로 오염

      expect(() => validateResult(mismatchedOrderObj)).toThrow('Creative Storyboard Scenes Validation Failed: Step order mismatch at index 1');
    });

    it('should throw error when step name is mismatched', () => {
      const mismatchedNameObj = JSON.parse(JSON.stringify(mockValidOutput));
      mismatchedNameObj.scenes[1].name = 'Attention'; // step 2의 name을 Attention으로 오염

      expect(() => validateResult(mismatchedNameObj)).toThrow("Creative Storyboard Scenes Validation Failed: Step name mismatch at step 2. Expected name 'Problem', got 'Attention'");
    });

    it('should throw error when null is provided', () => {
      const nullFieldObj = JSON.parse(JSON.stringify(mockValidOutput));
      nullFieldObj.scenes[0].title = null;

      expect(() => validateResult(nullFieldObj)).toThrow('[scenes.0.title]: Expected string, received null');
    });

    it('should throw error when empty string is provided', () => {
      const emptyStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      emptyStringObj.scenes[0].title = '';

      expect(() => validateResult(emptyStringObj)).toThrow('[scenes.0.title]: String must contain at least 1 character(s)');
    });

    it('should throw error when string exceeds max limit', () => {
      const longStringObj = JSON.parse(JSON.stringify(mockValidOutput));
      longStringObj.scenes[0].title = 'a'.repeat(1001); // max 1000

      expect(() => validateResult(longStringObj)).toThrow('[scenes.0.title]: String must contain at most 1000 character(s)');
    });
  });

  // 5. Provider Spec Tests
  describe('Provider Spec', () => {
    it('should return mock url when generateImage is called with mock key', async () => {
      const provider = new FluxImageProvider('mock-api-key');
      const url = await provider.generateImage('mock prompt description here');
      expect(url).toContain('https://images.flux.ai/outputs/mock_');
      expect(provider.getName()).toBe('FLUX.1-dev');
    });

    it('should formulate correct payload and call fetch for FLUX API', async () => {
      const mockFetchResponse = {
        ok: true,
        json: async () => ({ images: ['https://flux-api.com/result.jpg'] }),
      };
      const globalFetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as any);

      const provider = new FluxImageProvider('real-api-key');
      const url = await provider.generateImage('test image prompt', { aspectRatio: '16:9', steps: 30, guidanceScale: 4.5 });

      expect(url).toBe('https://flux-api.com/result.jpg');
      expect(globalFetchMock).toHaveBeenCalledTimes(1);

      const [passedUrl, passedInit] = globalFetchMock.mock.calls[0];
      expect(passedUrl).toBe('https://api.bfl.ml/v1/flux-1-dev');
      expect(passedInit?.method).toBe('POST');
      expect(JSON.parse(passedInit?.body as string)).toEqual({
        prompt: 'test image prompt',
        aspect_ratio: '16:9',
        steps: 30,
        guidance_scale: 4.5,
      });

      globalFetchMock.mockRestore();
    });

    it('should throw error when BFL API response is not ok', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 500,
      };
      const globalFetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as any);

      const provider = new FluxImageProvider('real-api-key');
      await expect(provider.generateImage('test')).rejects.toThrow('FLUX API Request Failed: Status 500');

      globalFetchMock.mockRestore();
    });

    it('should throw error when BFL API response does not contain image URL', async () => {
      const mockFetchResponse = {
        ok: true,
        json: async () => ({ unexpectedKey: 'value' }),
      };
      const globalFetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as any);

      const provider = new FluxImageProvider('real-api-key');
      await expect(provider.generateImage('test')).rejects.toThrow('FLUX API Response does not contain generated image URL');

      globalFetchMock.mockRestore();
    });

    it('should parse Replicate output format correctly', async () => {
      const mockFetchResponse = {
        ok: true,
        json: async () => ({ output: ['https://replicate.com/result.jpg'] }),
      };
      const globalFetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as any);

      const provider = new FluxImageProvider('real-api-key');
      const url = await provider.generateImage('test');

      expect(url).toBe('https://replicate.com/result.jpg');
      globalFetchMock.mockRestore();
    });

    it('should parse BFL result sample format correctly', async () => {
      const mockFetchResponse = {
        ok: true,
        json: async () => ({ result: { sample: 'https://bfl.com/sample.jpg' } }),
      };
      const globalFetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(mockFetchResponse as any);

      const provider = new FluxImageProvider('real-api-key');
      const url = await provider.generateImage('test');

      expect(url).toBe('https://bfl.com/sample.jpg');
      globalFetchMock.mockRestore();
    });
  });

  // 6. Service Spec Tests
  describe('Service Spec', () => {
    it('should orchestrate prompt generation, AI provider invocation, response parsing and validation successfully', async () => {
      const mockAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue(JSON.stringify(mockValidOutput)),
        getName: () => 'Mock Gemini Provider',
      };

      const mockImageProvider = new FluxImageProvider('mock-api-key');

      const service = new CreativeService(mockAIProvider, mockImageProvider);
      const result = await service.generateCreative(mockInput);

      expect(result).toEqual(mockValidOutput);
      expect(mockAIProvider.analyze).toHaveBeenCalledTimes(1);
      expect(service.getImageProvider()).toBe(mockImageProvider);

      const passedPrompt = (mockAIProvider.analyze as any).mock.calls[0][0];
      const passedOptions: AIRequestOptions = (mockAIProvider.analyze as any).mock.calls[0][1];

      expect(passedPrompt).toContain('친환경 텀블러');
      expect(passedOptions.temperature).toBe(0.2);
    });

    it('should pass options parameters to AI request options when customized options are provided', async () => {
      const mockAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue(JSON.stringify(mockValidOutput)),
        getName: () => 'Mock Gemini Provider',
      };
      const mockImageProvider = new FluxImageProvider('mock-api-key');

      const service = new CreativeService(mockAIProvider, mockImageProvider);
      const customOptions = {
        model: 'custom-model-pro',
        temperature: 0.8,
        maxOutputTokens: 2048,
        timeout: 15000,
      };

      const result = await service.generateCreative(mockInput, customOptions);
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
        analyze: vi.fn().mockResolvedValue('{"productName": "test", "scenes": []}'),
        getName: () => 'Mock Gemini Provider',
      };
      const mockImageProvider = new FluxImageProvider('mock-api-key');

      const service = new CreativeService(mockInvalidAIProvider, mockImageProvider);
      await expect(service.generateCreative(mockInput)).rejects.toThrow();
    });

    it('should propagate AI provider errors during generateCreative execution', async () => {
      const mockErrorAIProvider: AIProvider = {
        analyze: vi.fn().mockRejectedValue(new Error('Gemini API Error')),
        getName: () => 'Mock Gemini Provider',
      };
      const mockImageProvider = new FluxImageProvider('mock-api-key');

      const service = new CreativeService(mockErrorAIProvider, mockImageProvider);
      await expect(service.generateCreative(mockInput)).rejects.toThrow('Gemini API Error');
    });
  });

  // 7. Deterministic Spec Tests
  describe('Deterministic Spec', () => {
    it('should verify 100 identical prompts and output results under identical inputs', async () => {
      const prompt = buildPrompt(mockInput);
      const mockAIProvider: AIProvider = {
        analyze: vi.fn().mockResolvedValue(JSON.stringify(mockValidOutput)),
        getName: () => 'Mock Gemini Provider',
      };
      const mockImageProvider = new FluxImageProvider('mock-api-key');
      const service = new CreativeService(mockAIProvider, mockImageProvider);

      const firstOutput = await service.generateCreative(mockInput);

      for (let i = 0; i < 100; i++) {
        expect(buildPrompt(mockInput)).toBe(prompt);
        const loopOutput = await service.generateCreative(mockInput);
        expect(loopOutput).toEqual(firstOutput);
      }
    });
  });
});
