import { SupabaseClient } from '@supabase/supabase-js';
import { StoredAnalysis } from './types.js';

export class AIAnalysisRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async save(analysis: Omit<StoredAnalysis, 'id' | 'createdAt'>): Promise<StoredAnalysis> {
    const { data, error } = await this.supabase
      .from('review_analysis_results')
      .insert({
        analysis_identity: analysis.analysisIdentity,
        provider: analysis.provider,
        model: analysis.model,
        prompt_version: analysis.promptVersion,
        temperature: analysis.temperature,
        max_output_tokens: analysis.maxOutputTokens,
        keyword: analysis.keyword,
        review_count: analysis.reviewCount,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        complaints: analysis.complaints,
        jtbd: analysis.jtbd,
        keywords: analysis.keywords,
        sentiment: analysis.sentiment,
        prompt_tokens: analysis.promptTokens,
        completion_tokens: analysis.completionTokens,
        total_tokens: analysis.totalTokens,
        processing_time_ms: analysis.processingTimeMs,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }

    return this.mapToDto(data);
  }

  async findByIdentity(identity: string): Promise<StoredAnalysis | null> {
    const { data, error } = await this.supabase
      .from('review_analysis_results')
      .select()
      .eq('analysis_identity', identity)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find analysis by identity: ${error.message}`);
    }

    return data ? this.mapToDto(data) : null;
  }

  async findLatest(provider: string, keyword: string): Promise<StoredAnalysis | null> {
    const { data, error } = await this.supabase
      .from('review_analysis_results')
      .select()
      .eq('provider', provider)
      .eq('keyword', keyword)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find latest analysis: ${error.message}`);
    }

    return data ? this.mapToDto(data) : null;
  }

  async findById(id: string): Promise<StoredAnalysis | null> {
    const { data, error } = await this.supabase
      .from('review_analysis_results')
      .select()
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find analysis by id: ${error.message}`);
    }

    return data ? this.mapToDto(data) : null;
  }

  async exists(identity: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('review_analysis_results')
      .select('id')
      .eq('analysis_identity', identity)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check existence: ${error.message}`);
    }

    return !!data;
  }

  private mapToDto(row: Record<string, unknown>): StoredAnalysis {
    return {
      id: row.id as string,
      analysisIdentity: row.analysis_identity as string,
      provider: row.provider as string,
      model: row.model as string,
      promptVersion: row.prompt_version as string,
      temperature: Number(row.temperature),
      maxOutputTokens: row.max_output_tokens as number,
      keyword: row.keyword as string,
      reviewCount: row.review_count as number,
      summary: row.summary as string,
      strengths: row.strengths as string[],
      weaknesses: row.weaknesses as string[],
      complaints: row.complaints as string[],
      jtbd: row.jtbd as string[],
      keywords: row.keywords as string[],
      sentiment: row.sentiment as { positive: number; neutral: number; negative: number },
      promptTokens: row.prompt_tokens as number,
      completionTokens: row.completion_tokens as number,
      totalTokens: row.total_tokens as number,
      processingTimeMs: row.processing_time_ms as number,
      createdAt: row.created_at as string,
    };
  }
}
