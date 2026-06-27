import { MarketMetric } from './types.js';

export interface MarketResponseDto {
  metricId: string;
  runId: string;
  totalMonthlySearch: number;
  trendSlope: number;
  seasonalityClassification: string;
  rawTrendJson: Record<string, unknown> | unknown[];
}

export const toResponseDto = (entity: MarketMetric): MarketResponseDto => {
  return {
    metricId: entity.metric_id,
    runId: entity.run_id,
    totalMonthlySearch: entity.total_monthly_search,
    trendSlope: Number(entity.trend_slope),
    seasonalityClassification: entity.seasonality_classification,
    rawTrendJson: entity.raw_trend_json,
  };
};

export interface CreateMarketMetricDto {
  runId: string;
  totalMonthlySearch: number;
  trendSlope: number;
  seasonalityClassification: 'HIGH' | 'MEDIUM' | 'LOW';
  rawTrendJson: Record<string, unknown> | unknown[];
}

export interface UpdateMarketMetricDto {
  totalMonthlySearch?: number;
  trendSlope?: number;
  seasonalityClassification?: 'HIGH' | 'MEDIUM' | 'LOW';
  rawTrendJson?: Record<string, unknown> | unknown[];
}
