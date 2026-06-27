import { productStrategySchema } from './schema.js';
import { ProductStrategyResult } from './types.js';
import { STORYBOARD_STEPS } from './constants.js';

export function validateResult(parsedData: unknown): ProductStrategyResult {
  // 1. Zod Basic validation
  const result = productStrategySchema.safeParse(parsedData);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => `[${e.path.join('.') || 'root'}]: ${e.message}`)
      .join(', ');
    throw new Error(`Product Strategy Schema Validation Failed: ${errorDetails}`);
  }

  const data = result.data as ProductStrategyResult;
  const steps = data.storyboard.steps;

  // 2. 정확히 8개 단계 존재 여부 검증
  if (steps.length !== 8) {
    throw new Error(`Product Strategy Storyboard Validation Failed: Steps count must be exactly 8, got ${steps.length}`);
  }

  // 3. Step 1~8 순서 및 명칭 매칭 검증
  for (let i = 0; i < 8; i++) {
    const step = steps[i];
    const expected = STORYBOARD_STEPS[i];

    if (step.step !== expected.step) {
      throw new Error(`Product Strategy Storyboard Validation Failed: Step order mismatch at index ${i}. Expected step number ${expected.step}, got ${step.step}`);
    }

    if (step.type !== expected.type) {
      throw new Error(`Product Strategy Storyboard Validation Failed: Step type mismatch at step ${step.step}. Expected type '${expected.type}', got '${step.type}'`);
    }

    if (step.name !== expected.name) {
      throw new Error(`Product Strategy Storyboard Validation Failed: Step name mismatch at step ${step.step}. Expected name '${expected.name}', got '${step.name}'`);
    }
  }

  return data;
}
