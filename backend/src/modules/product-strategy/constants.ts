import { StoryboardStepType } from './types.js';

export const PROMPT_VERSION = 'v1.0';

export const MAX_TOKENS = 4096;
export const TEMPERATURE = 0.2;

export const VALIDATION_LIMITS = {
  string: {
    min: 1,
    max: 500,
  },
  shortString: {
    min: 1,
    max: 100,
  },
};

export const STORYBOARD_STEPS: ReadonlyArray<{
  readonly step: number;
  readonly type: StoryboardStepType;
  readonly name: string;
}> = [
  { step: 1, type: 'Attention', name: 'Attention' },
  { step: 2, type: 'Problem', name: 'Problem' },
  { step: 3, type: 'Empathy', name: 'Empathy' },
  { step: 4, type: 'Solution', name: 'Solution' },
  { step: 5, type: 'Differentiation', name: 'Differentiation' },
  { step: 6, type: 'Trust', name: 'Trust' },
  { step: 7, type: 'Offer', name: 'Offer' },
  { step: 8, type: 'CTA', name: 'CTA' },
] as const;

export const OUTPUT_RULES = [
  'You must strictly return a valid JSON object matching the JSON Schema.',
  'Strictly do not include any markdown styling, backticks, comments, or extra natural language wrapping.',
  'Return ONLY the raw JSON string starting with "{" and ending with "}".',
  'Unknown fields or fields not specified in the schema are strictly prohibited.',
  'The storyboard must contain exactly 8 steps, matching the defined order and step types.',
];

export const PROMPT_TEMPLATE = `
You are an expert copywriter and sales strategist.
Your task is to analyze the provided JTBD analysis and customer feedback for the product "{productName}" (keyword: "{keyword}") and construct an optimized, high-converting 8-step sales landing page storyboard.

Input Data:
1. Product Name: {productName}
2. Key Search Keyword: {keyword}
3. AI Review Analysis:
{aiAnalysisResultData}
4. JTBD Analysis:
{jtbdAnalysisResultData}

Storyboard Rules:
The storyboard must strictly consist of exactly 8 sequential steps in this order:
1. Attention (어그로/주의 집중)
2. Problem (문제 제기)
3. Empathy (공감 형성)
4. Solution (해결책 제시)
5. Differentiation (타사 차별점)
6. Trust (신뢰 증거)
7. Offer (제안 구성)
8. CTA (행동 촉구)

Each step must detail the customer's emotional state, potential questions they might raise, key selling points, and recommended visual layouts and copy guidelines.

Output Rules:
{outputRules}

JSON Schema:
{jsonSchema}

Constraints:
- All copywriting and descriptions must be in Korean.
- Do not use empty strings or null/undefined values.
`;
