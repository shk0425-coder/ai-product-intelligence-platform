import { AIProvider, AIRequestOptions } from '../ai/types.js';
import { JTBDAnalysisInput, JTBDAnalysisResult } from './types.js';
import { buildPrompt } from './prompt.js';
import { parseResponse } from './parser.js';
import { validateResult } from './validator.js';
import { MAX_TOKENS, TEMPERATURE, PROMPT_VERSION } from './constants.js';

export class JTBDAnalysisService {
  constructor(private readonly aiProvider: AIProvider) {}

  async analyze(input: JTBDAnalysisInput, options?: Partial<AIRequestOptions>): Promise<JTBDAnalysisResult> {
    // 1. Prompt 생성
    const prompt = buildPrompt(input);

    // 2. AI 호출 옵션 구성
    const requestOptions: AIRequestOptions = {
      model: options?.model || 'gemini-1.5-pro',
      temperature: options?.temperature ?? TEMPERATURE,
      maxOutputTokens: options?.maxOutputTokens ?? MAX_TOKENS,
      timeout: options?.timeout ?? 60000,
      promptVersion: options?.promptVersion || PROMPT_VERSION,
    };

    // 3. AI 호출
    const rawResponse = await this.aiProvider.analyze(prompt, requestOptions);

    // 4. Parser 호출
    const parsedData = parseResponse(rawResponse);

    // 5. Validator 호출 및 DTO 반환
    return validateResult(parsedData);
  }
}
