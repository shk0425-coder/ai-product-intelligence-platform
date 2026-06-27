import { creativeResultSchema } from './schema.js';
import { CreativeResult } from './types.js';
import { STORYBOARD_STEPS } from './constants.js';

export function validateResult(parsedData: unknown): CreativeResult {
  // 1. Zod Basic validation
  const result = creativeResultSchema.safeParse(parsedData);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => `[${e.path.join('.') || 'root'}]: ${e.message}`)
      .join(', ');
    throw new Error(`Creative Schema Validation Failed: ${errorDetails}`);
  }

  const data = result.data as CreativeResult;
  const scenes = data.scenes;

  // 2. 정확히 8개 Scene 존재 여부 검증
  if (scenes.length !== 8) {
    throw new Error(`Creative Storyboard Scenes Validation Failed: Scenes count must be exactly 8, got ${scenes.length}`);
  }

  // 3. Step 1~8 순서 및 명칭 매칭 검증
  for (let i = 0; i < 8; i++) {
    const scene = scenes[i];
    const expected = STORYBOARD_STEPS[i];

    if (scene.step !== expected.step) {
      throw new Error(`Creative Storyboard Scenes Validation Failed: Step order mismatch at index ${i}. Expected step number ${expected.step}, got ${scene.step}`);
    }

    if (scene.name !== expected.name) {
      throw new Error(`Creative Storyboard Scenes Validation Failed: Step name mismatch at step ${scene.step}. Expected name '${expected.name}', got '${scene.name}'`);
    }
  }

  return data;
}
