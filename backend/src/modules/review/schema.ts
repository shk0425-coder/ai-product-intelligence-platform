import { z } from 'zod';

export const crawlReviewsSchema = z.object({
  provider: z.enum(['naver'], {
    errorMap: () => ({ message: 'Only naver provider is allowed in this sprint' }),
  }),
  keyword: z
    .string()
    .trim()
    .min(1, 'Keyword is required')
    .max(50, 'Keyword must not exceed 50 characters'),
});

export type CrawlReviewsInput = z.infer<typeof crawlReviewsSchema>;
