import { createHash } from 'crypto';

export class IdentityGenerator {
  static generateCanonicalString(params: {
    provider: string;
    keyword: string;
    reviewCount: number;
    latestCollectedAt: string;
    promptVersion: string;
    model: string;
    temperature: number;
    maxOutputTokens: number;
  }): string {
    return [
      params.provider,
      params.keyword,
      params.reviewCount.toString(),
      params.latestCollectedAt,
      params.promptVersion,
      params.model,
      params.temperature.toString(),
      params.maxOutputTokens.toString(),
    ].join('\n');
  }

  static generate(params: {
    provider: string;
    keyword: string;
    reviewCount: number;
    latestCollectedAt: string;
    promptVersion: string;
    model: string;
    temperature: number;
    maxOutputTokens: number;
  }): string {
    const canonical = this.generateCanonicalString(params);
    return createHash('sha256').update(canonical).digest('hex');
  }
}
