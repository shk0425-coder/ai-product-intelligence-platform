import { RuleEngineInput, RuleEngineOutput, RuleEngineOptions, DebugInfo } from './types.js';
import { validateInput } from './validator.js';
import { calculateWeightedScore } from './score.js';
import { determineGrade } from './grade.js';
import { generateReasons } from './reason.js';
import { WEIGHTS } from './constants.js';

export function calculateGradeAndScore(
  input: RuleEngineInput,
  options?: RuleEngineOptions
): RuleEngineOutput {
  // 1. Validation
  validateInput(input);

  // 2. Normalization & Weighted Score
  const { totalScore, normalizedScores } = calculateWeightedScore(input);

  // 3. Grade
  const grade = determineGrade(totalScore);

  // 4. Reason
  const reason = generateReasons(input, normalizedScores);

  const output: RuleEngineOutput = {
    totalScore,
    grade,
    reason,
  };

  // 5. Debug Info (options.debug = true 일 때만 포함)
  if (options?.debug === true) {
    const debugInfo: Partial<DebugInfo> = {};
    const keys = Object.keys(WEIGHTS) as (keyof RuleEngineInput)[];

    for (const key of keys) {
      const raw = input[key];
      const weight = WEIGHTS[key];
      const norm = normalizedScores[key];
      // weighted = normalized * weight. 소수점 둘째 자리까지 반올림
      const weighted = Math.round(norm * weight * 100) / 100;

      debugInfo[key] = {
        raw,
        weight,
        weighted,
      };
    }

    output.debug = debugInfo as DebugInfo;
  }

  return output;
}
