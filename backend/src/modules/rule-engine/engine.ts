import { RuleEngineInput, RuleEngineOutput, RuleEngineOptions } from './types.js';
import { calculateGradeAndScore } from './calculator.js';
import { validateInput } from './validator.js';

export class RuleEngine {
  /**
   * AI Review Analysis 결과를 기반으로 100% 결정론적인 상품 등급 평가를 수행합니다.
   * 입력 객체를 절대 변경하지 않는 Stateless Pure Function 구조를 유지합니다.
   */
  static calculate(input: RuleEngineInput, options?: RuleEngineOptions): RuleEngineOutput {
    // 복사 이전에 원본 객체 유효성 검사 수행
    validateInput(input);

    // 입력 객체의 Immutability 보장을 위한 딥 카피
    const copiedInput: RuleEngineInput = {
      demandScore: input.demandScore,
      competitionScore: input.competitionScore,
      satisfactionScore: input.satisfactionScore,
      reviewVolume: input.reviewVolume,
      marketGrowth: input.marketGrowth,
      repeatPurchase: input.repeatPurchase,
      priceResistance: input.priceResistance,
      keywordConcentration: input.keywordConcentration,
    };

    return calculateGradeAndScore(copiedInput, options);
  }
}
