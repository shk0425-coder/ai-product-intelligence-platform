import { JTBDAnalysisInput } from './types.js';
import { PROMPT_TEMPLATE, OUTPUT_RULES } from './constants.js';
import { getJsonSchemaString } from './schema.js';

export function buildPrompt(input: JTBDAnalysisInput): string {
  // 1. 리뷰 데이터 포맷팅
  const reviewsData = input.reviews
    .map((r, idx) => `[Review ${idx + 1}] Rating: ${r.rating} | Content: ${r.raw_text}`)
    .join('\n');

  // 2. AI 분석 결과 포맷팅
  const aiAnalysisResultData = JSON.stringify(input.aiAnalysisResult, null, 2);

  // 3. 출력 규칙 포맷팅
  const outputRulesFormatted = OUTPUT_RULES.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n');

  // 4. JSON Schema 확보
  const jsonSchema = getJsonSchemaString();

  // 5. 템플릿 치환 (결정론적이며 순수함)
  let prompt = PROMPT_TEMPLATE;
  prompt = prompt.replace(/{productName}/g, input.productName);
  prompt = prompt.replace(/{keyword}/g, input.keyword);
  prompt = prompt.replace('{reviewsData}', reviewsData);
  prompt = prompt.replace('{aiAnalysisResultData}', aiAnalysisResultData);
  prompt = prompt.replace('{outputRules}', outputRulesFormatted);
  prompt = prompt.replace('{jsonSchema}', jsonSchema);

  return prompt;
}
