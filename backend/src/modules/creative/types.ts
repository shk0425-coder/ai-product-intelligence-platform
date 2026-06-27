import { ProductStrategyResult } from '../product-strategy/types.js';
import { JTBDAnalysisResult } from '../jtbd/types.js';

export type SceneType =
  | 'Attention'
  | 'Problem'
  | 'Empathy'
  | 'Solution'
  | 'Differentiation'
  | 'Trust'
  | 'Offer'
  | 'CTA';

export type PromptLanguage = 'EN' | 'KO';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export interface ImageStyle {
  styleName: string;
  elements: string[];
}

export interface CameraAngle {
  angle: string;
  shotType: string;
}

export interface Lighting {
  type: string;
  mood: string;
}

export interface Composition {
  focus: string;
  ruleOfThirds: boolean;
}

export interface StoryboardScene {
  step: number;
  name: SceneType;
  title: string;
  imagePrompt: string;
  negativePrompt: string;
  style: ImageStyle;
  composition: Composition;
  cameraAngle: CameraAngle;
  lighting: Lighting;
}

export interface CreativeInput {
  productName: string;
  keyword: string;
  jtbdAnalysisResult: JTBDAnalysisResult;
  productStrategyResult: ProductStrategyResult;
}

export interface CreativeResult {
  productName: string;
  keyword: string;
  scenes: StoryboardScene[];
}
