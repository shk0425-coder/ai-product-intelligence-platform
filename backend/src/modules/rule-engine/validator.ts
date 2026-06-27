import { RuleEngineInput } from './types.js';
import { VALIDATION_LIMITS } from './constants.js';

export function validateInput(input: unknown): asserts input is RuleEngineInput {
  if (input === null || input === undefined) {
    throw new Error('Input is null or undefined');
  }

  if (typeof input !== 'object') {
    throw new Error('Input must be an object');
  }

  const typedInput = input as Record<string, unknown>;
  const requiredKeys: (keyof RuleEngineInput)[] = [
    'demandScore',
    'competitionScore',
    'satisfactionScore',
    'reviewVolume',
    'marketGrowth',
    'repeatPurchase',
    'priceResistance',
    'keywordConcentration',
  ];

  for (const key of requiredKeys) {
    const val = typedInput[key];

    // undefined, null 검증
    if (val === undefined || val === null) {
      throw new Error(`Field ${key} is missing, null, or undefined`);
    }

    // NaN, Infinity 검증
    if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
      throw new Error(`Field ${key} must be a finite number`);
    }

    // 개별 범위 검증 (constants.ts의 VALIDATION_LIMITS 기준)
    if (key === 'reviewVolume') {
      if (val < VALIDATION_LIMITS.reviewVolume.min || val > VALIDATION_LIMITS.reviewVolume.max) {
        throw new Error(
          `Field reviewVolume must be between ${VALIDATION_LIMITS.reviewVolume.min} and ${VALIDATION_LIMITS.reviewVolume.max}`
        );
      }
    } else if (key === 'marketGrowth') {
      if (val < VALIDATION_LIMITS.marketGrowth.min || val > VALIDATION_LIMITS.marketGrowth.max) {
        throw new Error(
          `Field marketGrowth must be between ${VALIDATION_LIMITS.marketGrowth.min} and ${VALIDATION_LIMITS.marketGrowth.max}`
        );
      }
    } else {
      // 일반 Score 항목 (0 ~ 100)
      if (val < VALIDATION_LIMITS.score.min || val > VALIDATION_LIMITS.score.max) {
        throw new Error(`Field ${key} must be between ${VALIDATION_LIMITS.score.min} and ${VALIDATION_LIMITS.score.max}`);
      }
    }
  }
}
