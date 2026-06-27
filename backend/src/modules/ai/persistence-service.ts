import { SupabaseClient } from '@supabase/supabase-js';
import { AIAnalysisRepository } from './repository.js';
import { ReviewAnalyzerService } from './service.js';
import { IdentityGenerator } from './identity-generator.js';
import { StoredAnalysis, AIRequestOptions } from './types.js';

export class ReviewAnalysisPersistenceService {
  private readonly repository: AIAnalysisRepository;

  constructor(
    private readonly supabase: SupabaseClient,
    private readonly analyzerService: ReviewAnalyzerService
  ) {
    this.repository = new AIAnalysisRepository(supabase);
  }

  async analyzeAndPersist(
    providerName: string,
    keyword: string,
    maxReviews: number
  ): Promise<{ cached: boolean; data: StoredAnalysis }> {
    // 1. 리뷰 데이터 가져오기
    const reviews = await this.analyzerService.fetchReviews(keyword, maxReviews);
    const reviewCount = reviews.length;

    // 2. 최신 수집 일시 (latestCollectedAt) 결정
    const latestCollectedAt = reviews.length > 0
      ? new Date(reviews[0].collected_at).toISOString()
      : new Date(0).toISOString();

    const promptVersion = 'v1';
    const model = 'gemini-1.5-flash';
    const temperature = 0.2;
    const maxOutputTokens = 4096;

    // 3. Identity Generator를 통해 SHA-256 Identity 생성
    const analysisIdentity = IdentityGenerator.generate({
      provider: providerName,
      keyword,
      reviewCount,
      latestCollectedAt,
      promptVersion,
      model,
      temperature,
      maxOutputTokens,
    });

    // 4. Cache Hit 여부 조회
    const existing = await this.repository.findByIdentity(analysisIdentity);
    if (existing) {
      return {
        cached: true,
        data: existing,
      };
    }

    // 5. Cache Miss: AI 분석 실행
    const options: AIRequestOptions = {
      model,
      temperature,
      timeout: 60000,
      maxOutputTokens,
      promptVersion,
    };

    const {
      result,
      promptTokens,
      completionTokens,
      totalTokens,
      processingTimeMs,
    } = await this.analyzerService.analyzePreparedReviews(
      providerName,
      reviews,
      keyword,
      options
    );

    // 6. DB 저장
    const saved = await this.repository.save({
      analysisIdentity,
      provider: providerName,
      model,
      promptVersion,
      temperature,
      maxOutputTokens,
      keyword,
      reviewCount,
      summary: result.summary,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      complaints: result.complaints,
      jtbd: result.jtbd,
      keywords: result.keywords,
      sentiment: result.sentiment,
      promptTokens,
      completionTokens,
      totalTokens,
      processingTimeMs,
    });

    return {
      cached: false,
      data: saved,
    };
  }
}
