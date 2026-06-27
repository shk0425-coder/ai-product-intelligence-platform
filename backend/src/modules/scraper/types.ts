export interface ScrapedCompetitor {
  rank: number;
  brandName: string;
  mallType: string;
  price: number;
  reviewCount: number;
  rawMallName?: string;
}

export interface ScrapedMarketData {
  totalMonthlySearch: number;
  trendSlope: number;
  seasonalityClassification: 'HIGH' | 'MEDIUM' | 'LOW';
  rawTrendJson: Record<string, unknown> | unknown[];
  competitors: ScrapedCompetitor[];
}

export interface IScraperProvider {
  getName(): string;
  scrapeMarketData(keyword: string): Promise<ScrapedMarketData>;
}

export interface IScraperService {
  registerProvider(provider: IScraperProvider): void;
  getProvider(name: string): IScraperProvider | undefined;
  scrape(providerName: string, keyword: string): Promise<ScrapedMarketData>;
}
