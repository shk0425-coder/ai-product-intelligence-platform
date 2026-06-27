import { z } from 'zod';

export const analyzeReviewsSchema = z.object({
  provider: z.enum(['gemini'], {
    errorMap: () => ({ message: 'Only gemini provider is allowed in this sprint' }),
  }),
  keyword: z
    .string()
    .trim()
    .min(1, 'Keyword is required')
    .max(50, 'Keyword must not exceed 50 characters'),
  maxReviews: z
    .number()
    .int()
    .min(1, 'maxReviews must be at least 1')
    .max(500, 'maxReviews must not exceed 500')
    .default(100),
});

export type AnalyzeReviewsInput = z.infer<typeof analyzeReviewsSchema>;
