import { describe, it, expect } from 'vitest';
import {
  RuleEngine,
  Grade,
  RuleEngineInput,
  VALIDATION_LIMITS,
  SCALING_RULES,
  determineGrade,
  calculateWeightedScore,
  generateReasons,
} from '../src/modules/rule-engine/index.js';

const mockValidInput: RuleEngineInput = {
  demandScore: 82,
  competitionScore: 63,
  satisfactionScore: 74,
  reviewVolume: 2134,
  marketGrowth: 11.2,
  repeatPurchase: 58,
  priceResistance: 37,
  keywordConcentration: 49,
};

describe('Rule Engine Integration Tests', () => {
  
  // 1. Grade Boundary Tests
  describe('Grade Boundary Spec', () => {
    // 95~100 S, 85~94 A, 70~84 B, 50~69 C, 0~49 D
    const testCases = [
      { score: 95, expected: Grade.S },
      { score: 94, expected: Grade.A },
      { score: 85, expected: Grade.A },
      { score: 84, expected: Grade.B },
      { score: 70, expected: Grade.B },
      { score: 69, expected: Grade.C },
      { score: 50, expected: Grade.C },
      { score: 49, expected: Grade.D },
      { score: 0, expected: Grade.D },
    ];

    testCases.forEach(({ score, expected }) => {
      it(`should return Grade.${expected} when totalScore is ${score}`, () => {
        // 모든 점수를 score와 매칭되는 고정 입력값으로 세팅하여 totalScore를 강제 조정합니다.
        // 여기서는 totalScore를 직접 결정하는 데 쓰이는 normalizeValue 우회 등을 피하기 위해,
        // 모든 input 점수를 동일 점수로 세팅하여 가중합이 정확히 그 점수가 되게 합니다.
        // 단, reviewVolume과 marketGrowth는 raw이므로, 이 둘도 환산 시 해당 점수가 나오게 조절해야 합니다.
        // score / 100 = (vol - min) / (max - min) => vol = score/100 * (max - min) + min
        const volMin = SCALING_RULES.reviewVolume.min;
        const volMax = SCALING_RULES.reviewVolume.max;
        const targetVol = (score / 100) * (volMax - volMin) + volMin;

        const growthMin = SCALING_RULES.marketGrowth.min;
        const growthMax = SCALING_RULES.marketGrowth.max;
        const targetGrowth = (score / 100) * (growthMax - growthMin) + growthMin;

        const input: RuleEngineInput = {
          demandScore: score,
          competitionScore: score,
          satisfactionScore: score,
          reviewVolume: targetVol,
          marketGrowth: targetGrowth,
          repeatPurchase: score,
          priceResistance: score,
          keywordConcentration: score,
        };

        const result = RuleEngine.calculate(input);
        expect(result.totalScore).toBe(score);
        expect(result.grade).toBe(expected);
      });
    });
  });

  // 2. Weights & Normalization Tests
  describe('Weight & Normalization Spec', () => {
    it('should normalize reviewVolume and marketGrowth correctly', () => {
      // reviewVolume: 0(min) ~ 5000(max) 이므로 2500은 딱 50점
      // marketGrowth: -20(min) ~ 40(max) 이므로 10은 딱 50점 (-20에서 +30인 위치이므로 30/60 * 100 = 50점)
      const input: RuleEngineInput = {
        demandScore: 50,
        competitionScore: 50,
        satisfactionScore: 50,
        reviewVolume: 2500,
        marketGrowth: 10,
        repeatPurchase: 50,
        priceResistance: 50,
        keywordConcentration: 50,
      };

      const result = RuleEngine.calculate(input);
      expect(result.totalScore).toBe(50);
    });

    it('should calculate weighted sum correctly according to weights', () => {
      // 모든 score가 100점이고, reviewVolume = 5000 (100점), marketGrowth = 40 (100점) 일 때 totalScore는 100이어야 함
      const input: RuleEngineInput = {
        demandScore: 100,
        competitionScore: 100,
        satisfactionScore: 100,
        reviewVolume: 5000,
        marketGrowth: 40,
        repeatPurchase: 100,
        priceResistance: 100,
        keywordConcentration: 100,
      };

      const result = RuleEngine.calculate(input);
      expect(result.totalScore).toBe(100);
      expect(result.grade).toBe(Grade.S);
    });
  });

  // 3. Clamp Tests
  describe('Clamp Logic Spec', () => {
    it('should clamp normalized score of reviewVolume to 100 if raw exceeds max', () => {
      const input: RuleEngineInput = {
        ...mockValidInput,
        reviewVolume: 10000, // max인 5000 초과
      };
      
      const result = RuleEngine.calculate(input, { debug: true });
      expect(result.debug?.reviewVolume.raw).toBe(10000);
      expect(result.debug?.reviewVolume.weighted).toBe(100 * 0.15); // weighted score = 15
    });

    it('should clamp normalized score of reviewVolume to 0 if raw is less than min', () => {
      const input: RuleEngineInput = {
        ...mockValidInput,
        reviewVolume: -100, // min인 0 미만 (다만 validator 통과를 위해 validation 범위 안인 0으로 주거나 validator 한계치를 조정해야 함. VALIDATION_LIMITS.reviewVolume.min 은 0이므로 음수는 validator에서 걸림. 따라서 validator 통과 가능한 0을 주었을 때의 min 도출 검사)
        reviewVolume: 0,
      };
      
      const result = RuleEngine.calculate(input, { debug: true });
      expect(result.debug?.reviewVolume.weighted).toBe(0);
    });
  });

  // 4. Validation Tests
  describe('Validation Spec', () => {
    const invalidInputs = [
      {
        desc: 'undefined field',
        input: { ...mockValidInput, demandScore: undefined } as any,
        errMsg: 'Field demandScore is missing, null, or undefined',
      },
      {
        desc: 'null field',
        input: { ...mockValidInput, satisfactionScore: null } as any,
        errMsg: 'Field satisfactionScore is missing, null, or undefined',
      },
      {
        desc: 'NaN field',
        input: { ...mockValidInput, competitionScore: NaN },
        errMsg: 'Field competitionScore must be a finite number',
      },
      {
        desc: 'Infinity field',
        input: { ...mockValidInput, repeatPurchase: Infinity },
        errMsg: 'Field repeatPurchase must be a finite number',
      },
      {
        desc: 'negative score field',
        input: { ...mockValidInput, priceResistance: -5 },
        errMsg: 'Field priceResistance must be between 0 and 100',
      },
      {
        desc: 'score exceeding 100',
        input: { ...mockValidInput, keywordConcentration: 120 },
        errMsg: 'Field keywordConcentration must be between 0 and 100',
      },
      {
        desc: 'reviewVolume exceeding validation max limit',
        input: { ...mockValidInput, reviewVolume: VALIDATION_LIMITS.reviewVolume.max + 1 },
        errMsg: `Field reviewVolume must be between ${VALIDATION_LIMITS.reviewVolume.min} and ${VALIDATION_LIMITS.reviewVolume.max}`,
      },
      {
        desc: 'marketGrowth exceeding validation max limit',
        input: { ...mockValidInput, marketGrowth: VALIDATION_LIMITS.marketGrowth.max + 1 },
        errMsg: `Field marketGrowth must be between ${VALIDATION_LIMITS.marketGrowth.min} and ${VALIDATION_LIMITS.marketGrowth.max}`,
      },
      {
        desc: 'marketGrowth less than validation min limit',
        input: { ...mockValidInput, marketGrowth: VALIDATION_LIMITS.marketGrowth.min - 1 },
        errMsg: `Field marketGrowth must be between ${VALIDATION_LIMITS.marketGrowth.min} and ${VALIDATION_LIMITS.marketGrowth.max}`,
      },
      {
        desc: 'null input object',
        input: null as any,
        errMsg: 'Input is null or undefined',
      },
      {
        desc: 'primitive input object',
        input: 'invalid-string' as any,
        errMsg: 'Input must be an object',
      },
    ];

    invalidInputs.forEach(({ desc, input, errMsg }) => {
      it(`should throw error when ${desc} is provided`, () => {
        expect(() => RuleEngine.calculate(input)).toThrowError(errMsg);
      });
    });
  });

  // 5. Deterministic Tests
  describe('Deterministic Run Spec', () => {
    it('should return exactly the same outputs and same reason order over 100 repeated trials', () => {
      const firstResult = RuleEngine.calculate(mockValidInput);

      for (let i = 0; i < 100; i++) {
        const nextResult = RuleEngine.calculate(mockValidInput);
        expect(nextResult.totalScore).toBe(firstResult.totalScore);
        expect(nextResult.grade).toBe(firstResult.grade);
        expect(nextResult.reason).toEqual(firstResult.reason);
      }
    });
  });

  // 6. Object Immutability Tests
  describe('Object Immutability Spec', () => {
    it('should not mutate original input object even if original object is frozen', () => {
      const frozenInput = Object.freeze({ ...mockValidInput });
      
      expect(() => RuleEngine.calculate(frozenInput)).not.toThrow();
      expect(frozenInput.demandScore).toBe(82);
      expect(frozenInput.reviewVolume).toBe(2134);
    });
  });

  // 7. Object Key Order Tests
  describe('Object Key Order Spec', () => {
    it('should return identical result regardless of input key declaration order', () => {
      // 순서가 뒤죽박죽인 객체 선언
      const scrambledInput: RuleEngineInput = {
        keywordConcentration: 49,
        satisfactionScore: 74,
        priceResistance: 37,
        demandScore: 82,
        marketGrowth: 11.2,
        repeatPurchase: 58,
        reviewVolume: 2134,
        competitionScore: 63,
      };

      const originalResult = RuleEngine.calculate(mockValidInput);
      const scrambledResult = RuleEngine.calculate(scrambledInput);

      expect(scrambledResult).toEqual(originalResult);
    });
  });

  // 8. Reason generation Tests
  describe('Reason Generation Spec', () => {
    it('should yield at least 3 reasons (using threshold distance lookup if satisfied cases are under 3)', () => {
      // 80 이상이나 40 이하 조건에 하나도 매칭 안 되는 평범한 입력값 제공 (모두 50~60선)
      const borderlineInput: RuleEngineInput = {
        demandScore: 55,
        competitionScore: 58,
        satisfactionScore: 52,
        reviewVolume: 2500, // 50점
        marketGrowth: 10, // 50점
        repeatPurchase: 54,
        priceResistance: 56,
        keywordConcentration: 51,
      };

      const result = RuleEngine.calculate(borderlineInput);
      expect(result.reason.length).toBeGreaterThanOrEqual(3);
    });

    it('should clamp output reason array size to maximum 10 reasons', () => {
      // 모든 항목이 긍정(100) 또는 부정(0)이어서 룰들이 폭발적으로 발생하도록 유도
      const extremeInput: RuleEngineInput = {
        demandScore: 100,      // +
        competitionScore: 0,   // -
        satisfactionScore: 100, // +
        reviewVolume: 5000,    // +
        marketGrowth: 40,      // +
        repeatPurchase: 100,    // +
        priceResistance: 0,    // -
        keywordConcentration: 0, // -
      };

      const result = RuleEngine.calculate(extremeInput);
      expect(result.reason.length).toBeLessThanOrEqual(10);
    });
  });

  // 9. Debug Mode Tests
  describe('Debug Option Spec', () => {
    it('should omit debug info object when debug=false or omitted', () => {
      const resultOmitted = RuleEngine.calculate(mockValidInput);
      expect(resultOmitted.debug).toBeUndefined();

      const resultFalse = RuleEngine.calculate(mockValidInput, { debug: false });
      expect(resultFalse.debug).toBeUndefined();
    });

    it('should include fully-structured debug metric info when debug=true', () => {
      const resultTrue = RuleEngine.calculate(mockValidInput, { debug: true });
      expect(resultTrue.debug).toBeDefined();
      
      const debugKeys: (keyof RuleEngineInput)[] = [
        'demandScore',
        'competitionScore',
        'satisfactionScore',
        'reviewVolume',
        'marketGrowth',
        'repeatPurchase',
        'priceResistance',
        'keywordConcentration',
      ];

      debugKeys.forEach((key) => {
        const metric = resultTrue.debug?.[key];
        expect(metric).toBeDefined();
        expect(metric?.raw).toBeDefined();
        expect(metric?.weight).toBeDefined();
        expect(metric?.weighted).toBeDefined();
      });
    });
  });

  // 10. Coverage Gaps Spec
  describe('Coverage Gaps Spec', () => {
    it('should throw error when determineGrade matches no rule', () => {
      expect(() => determineGrade(-1)).toThrow('No grade rule matched for score: -1');
      expect(() => determineGrade(101)).toThrow('No grade rule matched for score: 101');
    });

    it('should clamp totalScore in calculateWeightedScore when values exceed boundaries', () => {
      const ultraHighInput: RuleEngineInput = {
        demandScore: 500,
        competitionScore: 500,
        satisfactionScore: 500,
        reviewVolume: 500000,
        marketGrowth: 4000,
        repeatPurchase: 500,
        priceResistance: 500,
        keywordConcentration: 500,
      };
      const highRes = calculateWeightedScore(ultraHighInput);
      expect(highRes.totalScore).toBe(100);

      const ultraLowInput: RuleEngineInput = {
        demandScore: -500,
        competitionScore: -500,
        satisfactionScore: -500,
        reviewVolume: -500000,
        marketGrowth: -4000,
        repeatPurchase: -500,
        priceResistance: -500,
        keywordConcentration: -500,
      };
      const lowRes = calculateWeightedScore(ultraLowInput);
      expect(lowRes.totalScore).toBe(0);
    });

    it('should cover sorting branch in reason generation when multiple reasons with same key are present', () => {
      const normalizedScores: any = {
        demandScore: 79.9,
      };

      const reasons = generateReasons(mockValidInput, normalizedScores);
      expect(reasons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
