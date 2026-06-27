import { SupabaseClient } from '@supabase/supabase-js';
import { AIAnalysisRepository } from './repository.js';
import { StoredAnalysis } from './types.js';

export class ReviewAnalysisQueryService {
  private readonly repository: AIAnalysisRepository;

  constructor(private readonly supabase: SupabaseClient) {
    this.repository = new AIAnalysisRepository(supabase);
  }

  async getLatestAnalysis(provider: string, keyword: string): Promise<StoredAnalysis | null> {
    return this.repository.findLatest(provider, keyword);
  }

  async getAnalysisById(id: string): Promise<StoredAnalysis | null> {
    return this.repository.findById(id);
  }
}
