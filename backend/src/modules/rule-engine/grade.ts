import { Grade } from './types.js';
import { GRADE_RULES } from './constants.js';

export function determineGrade(score: number): Grade {
  const matchedRule = GRADE_RULES.find((rule) => score >= rule.min && score <= rule.max);

  if (!matchedRule) {
    throw new Error(`No grade rule matched for score: ${score}`);
  }

  return matchedRule.grade;
}
