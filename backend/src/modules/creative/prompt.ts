import { CreativeInput } from './types.js';
import { PROMPT_TEMPLATE, IMAGE_STYLE_RULES, OUTPUT_RULES } from './constants.js';
import { getJsonSchemaString } from './schema.js';

export function buildPrompt(input: CreativeInput): string {
  // 1. JTBD 결과 포맷팅
  const jtbdAnalysisResultData = JSON.stringify(input.jtbdAnalysisResult, null, 2);

  // 2. Product Strategy 결과 포맷팅
  const productStrategyResultData = JSON.stringify(input.productStrategyResult, null, 2);

  // 3. 이미지 스타일 규칙 포맷팅
  const imageStyleRulesFormatted = IMAGE_STYLE_RULES.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n');

  // 4. 출력 규칙 포맷팅
  const outputRulesFormatted = OUTPUT_RULES.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n');

  // 5. JSON Schema 확보
  const jsonSchema = getJsonSchemaString();

  // 6. 템플릿 치환
  let prompt = PROMPT_TEMPLATE;
  prompt = prompt.replace(/{productName}/g, input.productName);
  prompt = prompt.replace(/{keyword}/g, input.keyword);
  prompt = prompt.replace('{jtbdAnalysisResultData}', jtbdAnalysisResultData);
  prompt = prompt.replace('{productStrategyResultData}', productStrategyResultData);
  prompt = prompt.replace('{imageStyleRules}', imageStyleRulesFormatted);
  prompt = prompt.replace('{outputRules}', outputRulesFormatted);
  prompt = prompt.replace('{jsonSchema}', jsonSchema);

  return prompt;
}
