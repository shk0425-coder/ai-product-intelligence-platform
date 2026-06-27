import { BaseScraperProvider } from './base.provider.js';
import { ScrapedMarketData, ScrapedCompetitor } from '../types.js';

export class NaverScraperProvider extends BaseScraperProvider {
  getName(): string {
    return 'naver';
  }

  async scrapeMarketData(keyword: string): Promise<ScrapedMarketData> {
    const hash = this.generateDeterministicHash(keyword);

    // Deterministic values mapped from hash
    const totalMonthlySearch = 5000 + ((hash * 17) % 85000);
    const trendSlopeValue = -0.5 + ((hash % 200) / 100); // between -0.5 and 1.5
    const trendSlope = Number(trendSlopeValue.toFixed(3));

    const seasonalityClasses: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW'];
    const seasonalityClassification = seasonalityClasses[hash % 3];

    const rawTrendJson = [
      { date: '2026-01-01', value: 10 + (hash % 40) },
      { date: '2026-02-01', value: 20 + (hash % 50) },
      { date: '2026-03-01', value: 30 + (hash % 60) },
    ];

    // Standard top 10 competitors generated deterministically
    const competitors: ScrapedCompetitor[] = Array.from({ length: 10 }).map((_, index) => {
      const rank = index + 1;
      const brandName = `Brand-${((hash + rank) * 13) % 100}`;
      const mallTypes = ['스마트스토어', '브랜드스토어', '대형몰', '일반몰'];
      const mallType = mallTypes[(hash + rank) % mallTypes.length];
      const price = 10000 + ((hash * rank * 11) % 90000); // 10,000 to 100,000
      const reviewCount = ((hash + rank) * 7) % 500;

      return {
        rank,
        brandName,
        mallType,
        price,
        reviewCount,
        rawMallName: `${brandName} Mall`,
      };
    });

    return {
      totalMonthlySearch,
      trendSlope,
      seasonalityClassification,
      rawTrendJson,
      competitors,
    };
  }
}
