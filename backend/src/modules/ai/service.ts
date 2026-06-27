import { SupabaseClient } from '@supabase/supabase-js';
import { AnalysisResult, AIRequestOptions } from './types.js';
import { TokenManager } from './token-manager.js';
import { PromptBuilder } from './prompt-builder.js';
import { ProviderFactory } from './provider-factory.js';
import { ResponseParser } from './parser.js';
import { AIValidator } from './validator.js';

export interface ReviewItem {
  raw_text: string;
  rating: number;
  collected_at: string;
}

export interface AnalysisResultWithMetrics {
  result: AnalysisResult;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  processingTimeMs: number;
}

export class ReviewAnalyzerService {
  constructor(private readonly supabase: SupabaseClient) {}

  async fetchReviews(keyword: string, maxReviews: number): Promise<ReviewItem[]> {
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

    return reviews;
  }

  async analyzePreparedReviews(
    providerName: string,
    reviews: ReviewItem[],
    keyword: string,
    options: AIRequestOptions
  ): Promise<AnalysisResultWithMetrics> {
    const truncated = TokenManager.truncateReviews(reviews, 4096, keyword);
    const prompt = PromptBuilder.build(truncated, keyword);

    const aiProvider = ProviderFactory.create(providerName);
    
    const startTime = performance.now();
    const rawResultText = await aiProvider.analyze(prompt, options);
    const endTime = performance.now();

    const jsonParsed = ResponseParser.parse(rawResultText);
    const validatedResult = AIValidator.validate(jsonParsed);

    const promptTokens = TokenManager.estimateTokens(prompt);
    const completionTokens = TokenManager.estimateTokens(rawResultText);
    const totalTokens = promptTokens + completionTokens;
    const processingTimeMs = Math.round(endTime - startTime);

    return {
      result: validatedResult,
      promptTokens,
      completionTokens,
      totalTokens,
      processingTimeMs,
    };
  }

  async analyzeReviews(
    providerName: string,
    keyword: string,
    maxReviews: number
  ): Promise<AnalysisResult> {
    const reviews = await this.fetchReviews(keyword, maxReviews);
    const options: AIRequestOptions = {
      model: 'gemini-1.5-flash',
      temperature: 0.2,
      timeout: 60000,
      maxOutputTokens: 4096,
      promptVersion: 'v1',
    };

    const { result } = await this.analyzePreparedReviews(
      providerName,
      reviews,
      keyword,
      options
    );

    return result;
  }
}
