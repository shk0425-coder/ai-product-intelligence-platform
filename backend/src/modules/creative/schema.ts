import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { VALIDATION_LIMITS } from './constants.js';

export const sceneTypeSchema = z.enum([
  'Attention',
  'Problem',
  'Empathy',
  'Solution',
  'Differentiation',
  'Trust',
  'Offer',
  'CTA',
]);

export const imageStyleSchema = z.object({
  styleName: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  elements: z.array(z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max)).min(1),
});

export const cameraAngleSchema = z.object({
  angle: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  shotType: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
});

export const lightingSchema = z.object({
  type: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  mood: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
});

export const compositionSchema = z.object({
  focus: z.string().min(VALIDATION_LIMITS.shortString.min).max(VALIDATION_LIMITS.shortString.max),
  ruleOfThirds: z.boolean(),
});

export const storyboardSceneSchema = z.object({
  step: z.number().int().min(1).max(8),
  name: sceneTypeSchema,
  title: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  imagePrompt: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  negativePrompt: z.string().min(VALIDATION_LIMITS.string.min).max(VALIDATION_LIMITS.string.max),
  style: imageStyleSchema,
  composition: compositionSchema,
  cameraAngle: cameraAngleSchema,
  lighting: lightingSchema,
});

export const creativeResultSchema = z.object({
  productName: z.string().min(1).max(100),
  keyword: z.string().min(1).max(100),
  scenes: z.array(storyboardSceneSchema),
}).strict();

export function getJsonSchemaString(): string {
  const jsonSchema = zodToJsonSchema(creativeResultSchema, {
    target: 'jsonSchema7',
  });
  return JSON.stringify(jsonSchema, null, 2);
}
