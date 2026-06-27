import { RuleEngineInput } from './types.js';
import { SCALING_RULES, WEIGHTS, SCORE_LIMITS } from './constants.js';

export function normalizeValue(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
}

export function calculateNormalizedScores(input: RuleEngineInput): Record<keyof RuleEngineInput, number> {
  return {
    demandScore: input.demandScore,
    competitionScore: input.competitionScore,
    satisfactionScore: input.satisfactionScore,
    reviewVolume: normalizeValue(
      input.reviewVolume,
      SCALING_RULES.reviewVolume.min,
      SCALING_RULES.reviewVolume.max
    ),
    marketGrowth: normalizeValue(
      input.marketGrowth,
      SCALING_RULES.marketGrowth.min,
      SCALING_RULES.marketGrowth.max
    ),
    repeatPurchase: input.repeatPurchase,
    priceResistance: input.priceResistance,
    keywordConcentration: input.keywordConcentration,
  };
}

export function calculateWeightedScore(input: RuleEngineInput): {
  totalScore: number;
  normalizedScores: Record<keyof RuleEngineInput, number>;
} {
  const normalized = calculateNormalizedScores(input);
  
  let weightedSum = 0;
  const keys = Object.keys(WEIGHTS) as (keyof RuleEngineInput)[];
  
  for (const key of keys) {
    weightedSum += normalized[key] * WEIGHTS[key];
  }

  // Math.round() 후 0 ~ 100 Clamp
  let totalScore = Math.round(weightedSum);
  if (totalScore < SCORE_LIMITS.min) totalScore = SCORE_LIMITS.min;
  if (totalScore > SCORE_LIMITS.max) totalScore = SCORE_LIMITS.max;

  return {
    totalScore,
    normalizedScores: normalized,
  };
}
