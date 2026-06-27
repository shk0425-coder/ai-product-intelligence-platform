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

export const createMarketMetricSchema = z.object({
  runId: z.string().uuid('Invalid run ID format'),
  totalMonthlySearch: z.number().int().nonnegative('Search count must be non-negative'),
  trendSlope: z.number({ invalid_type_error: 'Trend slope must be a number' }),
  seasonalityClassification: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  rawTrendJson: z.union([z.record(z.unknown()), z.array(z.unknown())]),
});

export const updateMarketMetricSchema = z.object({
  totalMonthlySearch: z.number().int().nonnegative('Search count must be non-negative').optional(),
  trendSlope: z.number({ invalid_type_error: 'Trend slope must be a number' }).optional(),
  seasonalityClassification: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  rawTrendJson: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional(),
});

export type CreateMarketMetricInput = z.infer<typeof createMarketMetricSchema>;
export type UpdateMarketMetricInput = z.infer<typeof updateMarketMetricSchema>;
