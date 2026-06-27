import { JTBDAnalysisResult } from '../jtbd/types.js';
import { AnalysisResult } from '../ai/types.js';

export type StoryboardStepType =
  | 'Attention'
  | 'Problem'
  | 'Empathy'
  | 'Solution'
  | 'Differentiation'
  | 'Trust'
  | 'Offer'
  | 'CTA';

export interface CustomerEmotion {
  current: string;
  desired: string;
}

export interface CustomerQuestion {
  question: string;
  answer: string;
}

export interface SellingPoint {
  hook: string;
  description: string;
}

export interface RecommendedContent {
  visualLayout: string;
  copywriting: string[];
}

export interface CTA {
  buttonText: string;
  actionUrlPlaceholder: string;
}

export interface StoryboardStep {
  step: number;
  type: StoryboardStepType;
  name: string;
  title: string;
  objective: string;
  customerEmotion: CustomerEmotion;
  customerQuestion: CustomerQuestion;
  sellingPoint: SellingPoint;
  recommendedContent: RecommendedContent;
  cta?: CTA;
}

export interface Storyboard {
  steps: StoryboardStep[];
}

export interface ProductStrategyInput {
  productName: string;
  keyword: string;
  aiAnalysisResult: AnalysisResult;
  jtbdAnalysisResult: JTBDAnalysisResult;
}

export interface ProductStrategyResult {
  productName: string;
  keyword: string;
  storyboard: Storyboard;
}
