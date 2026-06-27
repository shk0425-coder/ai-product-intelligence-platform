export const PROMPT_VERSION = 'v1.0';

export const MAX_REVIEWS = 50;
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
  charCount: {
    min: 1,
    max: 200,
  },
};

export const OUTPUT_RULES = [
  'You must strictly return a valid JSON object matching the JSON Schema.',
  'Strictly do not include any markdown styling, backticks, comments, or extra natural language wrapping.',
  'Return ONLY the raw JSON string starting with "{" and ending with "}".',
  'Unknown fields or fields not specified in the schema are strictly prohibited.',
];

export const PROMPT_TEMPLATE = `
You are an expert market analyst specializing in Job-To-Be-Done (JTBD) framework.
Your task is to analyze the provided customer reviews and AI analysis summary for the product "{productName}" (keyword: "{keyword}") to extract core JTBD profiles, pain points, desired outcomes, purchase motivations, purchase barriers, usage contexts, customer segments, and unexpected insights.

Input Data:
1. Product Name: {productName}
2. Key Search Keyword: {keyword}
3. Customer Reviews:
{reviewsData}
4. AI Review Analysis Summary:
{aiAnalysisResultData}

Output Rules:
{outputRules}

JSON Schema:
{jsonSchema}

Constraints:
- All text output must be in Korean.
- Ensure each list contains at least one high-quality item.
- Do not use empty strings or null/undefined values.
`;
