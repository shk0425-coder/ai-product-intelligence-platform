import { SceneType } from './types.js';

export const PROMPT_VERSION = 'v1.0';

export const MAX_TOKENS = 4096;
export const TEMPERATURE = 0.2;

export const VALIDATION_LIMITS = {
  string: {
    min: 1,
    max: 1000,
  },
  shortString: {
    min: 1,
    max: 100,
  },
};

export const STORYBOARD_STEPS: ReadonlyArray<{
  readonly step: number;
  readonly name: SceneType;
}> = [
  { step: 1, name: 'Attention' },
  { step: 2, name: 'Problem' },
  { step: 3, name: 'Empathy' },
  { step: 4, name: 'Solution' },
  { step: 5, name: 'Differentiation' },
  { step: 6, name: 'Trust' },
  { step: 7, name: 'Offer' },
  { step: 8, name: 'CTA' },
] as const;

export const FLUX_DEFAULT_OPTIONS = {
  aspectRatio: '1:1',
  steps: 28,
  guidanceScale: 3.5,
  outputFormat: 'webp',
};

export const IMAGE_STYLE_RULES = [
  'Generate prompts in English optimized for FLUX model.',
  'Style: Professional commercial photography, clean studio lighting, realistic details.',
  'Avoid text, typography, logos, or watermarks in the generated image prompt description.',
];

export const OUTPUT_RULES = [
  'You must strictly return a valid JSON object matching the JSON Schema.',
  'Strictly do not include any markdown styling, backticks, comments, or extra natural language wrapping.',
  'Return ONLY the raw JSON string starting with "{" and ending with "}".',
  'Unknown fields or fields not specified in the schema are strictly prohibited.',
  'The scenes must contain exactly 8 steps, matching the defined order and step types.',
];

export const PROMPT_TEMPLATE = `
You are an expert AI prompt engineer and creative director.
Your task is to analyze the provided Product Strategy 8-step storyboard for "{productName}" (keyword: "{keyword}") and construct detailed, optimized image generation prompts for each step suitable for the FLUX text-to-image model.

Input Data:
1. Product Name: {productName}
2. Key Search Keyword: {keyword}
3. JTBD Analysis:
{jtbdAnalysisResultData}
4. Product Strategy Storyboard:
{productStrategyResultData}

Creative Prompt Generation Rules:
For each of the 8 storyboard steps, you must output:
- A descriptive english "imagePrompt" specifying the subject, context, style details, composition, camera angle, and lighting.
- A "negativePrompt" to guide quality and avoid unwanted elements.
- "style" indicating styleName and distinct elements.
- "composition", "cameraAngle", and "lighting" specifications.

Image Rules:
{imageStyleRules}

Output Rules:
{outputRules}

JSON Schema:
{jsonSchema}

Constraints:
- The imagePrompt and negativePrompt must be written in English.
- The title must match the title of the input storyboard step exactly.
- Step numbering (1 to 8) and scene names must align precisely with the input storyboard.
- Do not use empty strings or null/undefined values.
`;
