import { IScraperService, IScraperProvider, ScrapedMarketData } from './types.js';
import { NaverScraperProvider } from './providers/naver.provider.js';

export class ScraperService implements IScraperService {
  private providers = new Map<string, IScraperProvider>();

  constructor() {
    this.registerProvider(new NaverScraperProvider());
  }

  registerProvider(provider: IScraperProvider): void {
    this.providers.set(provider.getName(), provider);
  }

  getProvider(name: string): IScraperProvider | undefined {
    return this.providers.get(name);
  }

  async scrape(providerName: string, keyword: string): Promise<ScrapedMarketData> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Scraper provider "${providerName}" not registered.`);
    }
    return provider.scrapeMarketData(keyword);
  }
}
