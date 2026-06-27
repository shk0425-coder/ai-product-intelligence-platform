import { z } from 'zod';

export const marketIdParamSchema = z.object({
  id: z.string().uuid('Invalid market metric ID format'),
});

export const marketQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(100000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['total_monthly_search', 'trend_slope', 'seasonality_classification']).default('total_monthly_search'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type MarketQueryInput = z.infer<typeof marketQuerySchema>;
export type MarketIdParamInput = z.infer<typeof marketIdParamSchema>;
