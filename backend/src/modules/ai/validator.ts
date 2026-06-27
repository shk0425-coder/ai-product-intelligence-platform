import { z } from 'zod';
import { AnalysisResult } from './types.js';
import { AIResponseValidationError } from '../../common/errors/index.js';

export const analysisResultSchema = z.object({
  summary: z.string({ required_error: 'summary is required' }),
  strengths: z.array(z.string()).min(1, 'strengths must contain at least 1 item'),
  weaknesses: z.array(z.string()).min(1, 'weaknesses must contain at least 1 item'),
  complaints: z.array(z.string(), { required_error: 'complaints is required' }),
  jtbd: z.array(z.string(), { required_error: 'jtbd is required' }),
  keywords: z.array(z.string(), { required_error: 'keywords is required' }),
  sentiment: z.object({
    positive: z.number({ required_error: 'positive sentiment is required' }),
    neutral: z.number({ required_error: 'neutral sentiment is required' }),
    negative: z.number({ required_error: 'negative sentiment is required' }),
  }),
});

export class AIValidator {
  static validate(data: unknown): AnalysisResult {
    const parsed = analysisResultSchema.safeParse(data);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new AIResponseValidationError(`Zod validation failed: ${errorMsg}`);
    }

    const val = parsed.data as AnalysisResult;

    if (!val.summary.trim()) {
      throw new AIResponseValidationError('Business validation failed: summary cannot be empty');
    }

    const { positive, neutral, negative } = val.sentiment;
    const sentimentSum = positive + neutral + negative;
    if (Math.abs(sentimentSum - 100) > 0.01) {
      throw new AIResponseValidationError(
        `Business validation failed: sentiment total sum must equal 100 (got ${sentimentSum})`
      );
    }

    return val;
  }
}
