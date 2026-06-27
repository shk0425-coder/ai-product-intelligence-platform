import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { VALIDATION_LIMITS } from './constants.js';

export const storyboardStepTypeSchema = z.enum([
  'Attention',
  'Problem',
  'Empathy',
  'Solution',
  'Differentiation',
  'Trust',
  'Offer',
  'CTA',
]);

export const customerEmotionSchema = z.object({
  current: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  desired: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const customerQuestionSchema = z.object({
  question: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  answer: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const sellingPointSchema = z.object({
  hook: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  description: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const recommendedContentSchema = z.object({
  visualLayout: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  copywriting: z.array(z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max)).min(1),
});

export const ctaSchema = z.object({
  buttonText: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  actionUrlPlaceholder: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
});

export const storyboardStepSchema = z.object({
  step: z.number().int().min(1).max(8),
  type: storyboardStepTypeSchema,
  name: z.string().min(1).max(100),
  title: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  objective: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  customerEmotion: customerEmotionSchema,
  customerQuestion: customerQuestionSchema,
  sellingPoint: sellingPointSchema,
  recommendedContent: recommendedContentSchema,
  cta: ctaSchema.optional(),
});

export const productStrategySchema = z.object({
  productName: z.string().min(1).max(100),
  keyword: z.string().min(1).max(100),
  storyboard: z.object({
    steps: z.array(storyboardStepSchema),
  }),
}).strict();

export function getJsonSchemaString(): string {
  const jsonSchema = zodToJsonSchema(productStrategySchema, {
    target: 'jsonSchema7',
  });
  return JSON.stringify(jsonSchema, null, 2);
}
