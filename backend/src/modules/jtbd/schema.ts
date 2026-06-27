import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { VALIDATION_LIMITS } from './constants.js';

export const severitySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);
export const prioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

export const jtbdSchema = z.object({
  situation: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  coreJob: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  emotionalOutcome: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const painPointSchema = z.object({
  category: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  description: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  severity: severitySchema,
});

export const desiredOutcomeSchema = z.object({
  outcome: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  priority: prioritySchema,
});

export const purchaseMotivationSchema = z.object({
  trigger: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  expectedBenefit: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const purchaseBarrierSchema = z.object({
  barrier: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  mitigationFactor: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const usageContextSchema = z.object({
  where: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  when: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  how: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
});

export const customerSegmentSchema = z.object({
  segmentName: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  characteristics: z.array(
    z.string().min(VALIDATION_LIMITS.charCount.min).max(VALIDATION_LIMITS.charCount.max)
  ).min(1),
});

export const unexpectedInsightSchema = z.object({
  insight: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  implication: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const jtbdAnalysisResultSchema = z.object({
  jtbd: z.array(jtbdSchema).min(1),
  painPoints: z.array(painPointSchema).min(1),
  desiredOutcomes: z.array(desiredOutcomeSchema).min(1),
  purchaseMotivation: z.array(purchaseMotivationSchema).min(1),
  purchaseBarrier: z.array(purchaseBarrierSchema).min(1),
  usageContext: z.array(usageContextSchema).min(1),
  customerSegments: z.array(customerSegmentSchema).min(1),
  unexpectedInsights: z.array(unexpectedInsightSchema).min(1),
}).strict();

export function getJsonSchemaString(): string {
  const jsonSchema = zodToJsonSchema(jtbdAnalysisResultSchema, {
    target: 'jsonSchema7',
  });
  return JSON.stringify(jsonSchema, null, 2);
}
