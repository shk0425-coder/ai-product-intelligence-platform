import { SupabaseClient } from '@supabase/supabase-js';
import { AnalysisResult, AIRequestOptions } from './types.js';
import { TokenManager } from './token-manager.js';
import { PromptBuilder } from './prompt-builder.js';
import { ProviderFactory } from './provider-factory.js';
import { ResponseParser } from './parser.js';
import { AIValidator } from './validator.js';

export class ReviewAnalyzerService {
  constructor(private readonly supabase: SupabaseClient) {}

  async analyzeReviews(
    providerName: string,
    keyword: string,
    maxReviews: number
  ): Promise<AnalysisResult> {
    let query = this.supabase
      .from('customer_reviews')
      .select('raw_text, rating, collected_at')
      .order('collected_at', { ascending: false });

    if (keyword) {
      query = query.ilike('raw_text', `%${keyword}%`);
    }

    const { data: rawReviews, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    let reviews = (rawReviews || []).map((r) => ({
      raw_text: r.raw_text,
      rating: r.rating,
      collected_at: r.collected_at,
    }));

    if (reviews.length === 0) {
      const { data: fallbackReviews } = await this.supabase
        .from('customer_reviews')
        .select('raw_text, rating, collected_at')
        .order('collected_at', { ascending: false })
        .limit(maxReviews);
      
      reviews = (fallbackReviews || []).map((r) => ({
        raw_text: r.raw_text,
        rating: r.rating,
        collected_at: r.collected_at,
      }));
    } else {
      reviews = reviews.slice(0, maxReviews);
    }

    const options: AIRequestOptions = {
      model: 'gemini-1.5-flash',
      temperature: 0.2,
      timeout: 60000,
      maxOutputTokens: 4096,
      promptVersion: 'v1',
    };

    const truncated = TokenManager.truncateReviews(reviews, 4096, keyword);

    const prompt = PromptBuilder.build(truncated, keyword);

    const aiProvider = ProviderFactory.create(providerName);
    const rawResultText = await aiProvider.analyze(prompt, options);

    const jsonParsed = ResponseParser.parse(rawResultText);

    return AIValidator.validate(jsonParsed);
  }
}
