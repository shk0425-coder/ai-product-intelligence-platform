import { Grade, RuleEngineInput } from './types.js';

export const WEIGHTS: Record<keyof RuleEngineInput, number> = {
  demandScore: 0.15,
  competitionScore: 0.15,
  satisfactionScore: 0.10,
  reviewVolume: 0.15,
  marketGrowth: 0.15,
  repeatPurchase: 0.10,
  priceResistance: 0.10,
  keywordConcentration: 0.10,
};

export const SCALING_RULES = {
  reviewVolume: {
    min: 0,
    max: 5000,
  },
  marketGrowth: {
    min: -20,
    max: 40,
  },
};

export const GRADE_RULES = [
  { grade: Grade.S, min: 95, max: 100 },
  { grade: Grade.A, min: 85, max: 94 },
  { grade: Grade.B, min: 70, max: 84 },
  { grade: Grade.C, min: 50, max: 69 },
  { grade: Grade.D, min: 0, max: 49 },
];

export const VALIDATION_LIMITS = {
  score: {
    min: 0,
    max: 100,
  },
  reviewVolume: {
    min: 0,
    max: 1000000,
  },
  marketGrowth: {
    min: -100,
    max: 500,
  },
};

export interface ReasonRule {
  key: keyof RuleEngineInput;
  type: 'positive' | 'negative';
  threshold: number;
  message: string;
}

export const REASON_RULES: ReasonRule[] = [
  {
    key: 'demandScore',
    type: 'positive',
    threshold: 80,
    message: '시장 수요가 매우 높고 탐색 트렌드가 활발합니다.',
  },
  {
    key: 'demandScore',
    type: 'negative',
    threshold: 40,
    message: '시장 수요가 저조하고 검색량 추세가 하락세입니다.',
  },
  {
    key: 'competitionScore',
    type: 'positive',
    threshold: 80,
    message: '경쟁 강도가 낮아 신규 브랜드의 진입 장벽이 낮습니다.',
  },
  {
    key: 'competitionScore',
    type: 'negative',
    threshold: 40,
    message: '경쟁 강도가 극도로 높아 상위권 진입이 어렵습니다.',
  },
  {
    key: 'satisfactionScore',
    type: 'positive',
    threshold: 80,
    message: '기존 구매 고객들의 제품 전반 만족도가 높습니다.',
  },
  {
    key: 'satisfactionScore',
    type: 'negative',
    threshold: 40,
    message: '기존 제품들의 고객 평점 및 만족도가 낮아 개선이 필요합니다.',
  },
  {
    key: 'reviewVolume',
    type: 'positive',
    threshold: 80,
    message: '누적 리뷰 볼륨이 풍부하여 시장 신뢰도가 형성되어 있습니다.',
  },
  {
    key: 'reviewVolume',
    type: 'negative',
    threshold: 40,
    message: '리뷰 볼륨이 너무 작아 시장의 충분한 검증이 부족합니다.',
  },
  {
    key: 'marketGrowth',
    type: 'positive',
    threshold: 80,
    message: '시장 연간 성장성이 우수하여 향후 확장 가능성이 큽니다.',
  },
  {
    key: 'marketGrowth',
    type: 'negative',
    threshold: 40,
    message: '시장 성장이 정체되거나 역성장하는 시그널이 관측됩니다.',
  },
  {
    key: 'repeatPurchase',
    type: 'positive',
    threshold: 80,
    message: '재구매 의향이 높아 장기적인 고객 락인 효과가 기대됩니다.',
  },
  {
    key: 'repeatPurchase',
    type: 'negative',
    threshold: 40,
    message: '재구매 비율이 낮아 일회성 구매에 그칠 리스크가 존재합니다.',
  },
  {
    key: 'priceResistance',
    type: 'positive',
    threshold: 80,
    message: '고객의 가격 저항이 낮아 고단가 마진 상품 설계에 유리합니다.',
  },
  {
    key: 'priceResistance',
    type: 'negative',
    threshold: 40,
    message: '가격 저항감이 높아 할인가 중심의 박리다매 구조가 예상됩니다.',
  },
  {
    key: 'keywordConcentration',
    type: 'positive',
    threshold: 80,
    message: '특정 키워드 편중이 낮아 롱테일 키워드 유입 최적화에 적합합니다.',
  },
  {
    key: 'keywordConcentration',
    type: 'negative',
    threshold: 40,
    message: '독과점 형태의 키워드 집중도가 높아 광고비 부담이 큽니다.',
  },
];

// 고정된 우선순위 리스트 (Reason 반환 시 배열 순서 정렬의 기준)
export const REASON_PRIORITY: (keyof RuleEngineInput)[] = [
  'demandScore',
  'competitionScore',
  'satisfactionScore',
  'reviewVolume',
  'marketGrowth',
  'repeatPurchase',
  'priceResistance',
  'keywordConcentration',
];

export const SCORE_LIMITS = {
  min: 0,
  max: 100,
};
