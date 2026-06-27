import { IScraperProvider, ScrapedMarketData } from '../types.js';

export abstract class BaseScraperProvider implements IScraperProvider {
  abstract getName(): string;
  abstract scrapeMarketData(keyword: string): Promise<ScrapedMarketData>;

  protected generateDeterministicHash(text: string): number {
    return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
}
