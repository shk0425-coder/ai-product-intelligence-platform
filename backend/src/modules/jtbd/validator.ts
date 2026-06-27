import { jtbdAnalysisResultSchema } from './schema.js';
import { JTBDAnalysisResult } from './types.js';

export function validateResult(parsedData: unknown): JTBDAnalysisResult {
  const result = jtbdAnalysisResultSchema.safeParse(parsedData);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => {
        const fieldPath = e.path.join('.') || 'root';
        return `[${fieldPath}]: ${e.message}`;
      })
      .join(', ');
    throw new Error(`JTBD Schema Validation Failed: ${errorDetails}`);
  }
  return result.data as JTBDAnalysisResult;
}
