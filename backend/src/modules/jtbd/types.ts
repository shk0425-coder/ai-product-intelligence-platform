import { ReviewItem } from '../ai/service.js';
import { AnalysisResult } from '../ai/types.js';

export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface JTBDAnalysisInput {
  productName: string;
  keyword: string;
  reviews: ReviewItem[];
  aiAnalysisResult: AnalysisResult;
}

export interface JTBD {
  situation: string;
  coreJob: string;
  emotionalOutcome: string;
}

export interface PainPoint {
  category: string;
  description: string;
  severity: Severity;
}

export interface DesiredOutcome {
  outcome: string;
  priority: Priority;
}

export interface PurchaseMotivation {
  trigger: string;
  expectedBenefit: string;
}

export interface PurchaseBarrier {
  barrier: string;
  mitigationFactor: string;
}

export interface UsageContext {
  where: string;
  when: string;
  how: string;
}

export interface CustomerSegment {
  segmentName: string;
  characteristics: string[];
}

export interface UnexpectedInsight {
  insight: string;
  implication: string;
}

export interface JTBDAnalysisResult {
  jtbd: JTBD[];
  painPoints: PainPoint[];
  desiredOutcomes: DesiredOutcome[];
  purchaseMotivation: PurchaseMotivation[];
  purchaseBarrier: PurchaseBarrier[];
  usageContext: UsageContext[];
  customerSegments: CustomerSegment[];
  unexpectedInsights: UnexpectedInsight[];
}
