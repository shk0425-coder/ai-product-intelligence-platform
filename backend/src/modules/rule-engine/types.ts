export enum Grade {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface RuleEngineInput {
  demandScore: number;
  competitionScore: number;
  satisfactionScore: number;
  reviewVolume: number;
  marketGrowth: number;
  repeatPurchase: number;
  priceResistance: number;
  keywordConcentration: number;
}

export interface DebugMetric {
  raw: number;
  weight: number;
  weighted: number;
}

export interface DebugInfo {
  demandScore: DebugMetric;
  competitionScore: DebugMetric;
  satisfactionScore: DebugMetric;
  reviewVolume: DebugMetric;
  marketGrowth: DebugMetric;
  repeatPurchase: DebugMetric;
  priceResistance: DebugMetric;
  keywordConcentration: DebugMetric;
}

export interface RuleEngineOutput {
  totalScore: number;
  grade: Grade;
  reason: string[];
  debug?: DebugInfo;
}

export interface RuleEngineOptions {
  debug?: boolean;
}
