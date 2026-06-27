import { RuleEngineInput } from './types.js';
import { REASON_RULES, REASON_PRIORITY, ReasonRule } from './constants.js';

interface EvaluatedReason {
  rule: ReasonRule;
  isActive: boolean;
  distance: number;
}

export function generateReasons(
  input: RuleEngineInput,
  normalizedScores: Record<keyof RuleEngineInput, number>
): string[] {
  const evaluations: EvaluatedReason[] = REASON_RULES.map((rule) => {
    const score = normalizedScores[rule.key];
    let isActive = false;
    let distance = Infinity;

    if (rule.type === 'positive') {
      if (score >= 80) {
        isActive = true;
        distance = 0;
      } else {
        distance = 80 - score;
      }
    } else {
      // rule.type === 'negative'
      if (score <= 40) {
        isActive = true;
        distance = 0;
      } else {
        distance = score - 40;
      }
    }

    return { rule, isActive, distance };
  });

  let activeEvaluations = evaluations.filter((e) => e.isActive);

  // 최소 3개 보장 정책 (활성화된 사유가 3개 미만일 때)
  if (activeEvaluations.length < 3) {
    const inactiveEvaluations = evaluations
      .filter((e) => !e.isActive)
      .sort((a, b) => a.distance - b.distance);

    const needed = 3 - activeEvaluations.length;
    for (let i = 0; i < needed && i < inactiveEvaluations.length; i++) {
      activeEvaluations.push(inactiveEvaluations[i]);
    }
  }

  // Reason 우선순위에 따른 정렬
  // constants.ts의 REASON_PRIORITY 상의 키 인덱스 기준으로 정렬하고, 
  // 동일 키일 경우 positive가 negative보다 먼저 나오도록 정렬합니다.
  activeEvaluations.sort((a, b) => {
    const idxA = REASON_PRIORITY.indexOf(a.rule.key);
    const idxB = REASON_PRIORITY.indexOf(b.rule.key);

    if (idxA !== idxB) {
      return idxA - idxB;
    }

    return a.rule.type === 'positive' ? -1 : 1;
  });

  // 최대 10개 반환 정책
  const messages = activeEvaluations.map((e) => e.rule.message);
  return messages.slice(0, 10);
}
