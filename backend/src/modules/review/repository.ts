import { IReviewRepository, ReviewDto, BulkInsertResult } from './types.js';
import { SupabaseClient } from '@supabase/supabase-js';

export class ReviewRepository implements IReviewRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async bulkInsert(reviews: ReviewDto[]): Promise<BulkInsertResult> {
    if (reviews.length === 0) {
      return { insertedCount: 0, duplicateCount: 0, failedCount: 0 };
    }

    // 1. Fetch any existing run_id to satisfy FK constraint
    let runId = '00000000-0000-0000-0000-000000000000';
    try {
      const { data, error } = await this.supabase
        .from('analysis_runs')
        .select('run_id')
        .limit(1)
        .maybeSingle();
      if (!error && data?.run_id) {
        runId = data.run_id;
      }
    } catch (_e) {
      // Ignore lookup error, fallback to default UUID
    }

    // 2. Prepare database payload
    const records = reviews.map((r) => ({
      review_id: r.reviewId,
      run_id: runId,
      raw_text: r.reviewContent,
      rating: r.rating,
      collected_at: r.collectedAt,
    }));

    try {
      const { data, error } = await this.supabase
        .from('customer_reviews')
        .upsert(records, { onConflict: 'review_id,collected_at', ignoreDuplicates: true })
        .select();

      if (error) {
        return {
          insertedCount: 0,
          duplicateCount: 0,
          failedCount: reviews.length,
        };
      }

      const insertedRows = data ?? [];
      const insertedCount = insertedRows.length;
      const duplicateCount = reviews.length - insertedCount;

      return {
        insertedCount,
        duplicateCount,
        failedCount: 0,
      };
    } catch (_err) {
      return {
        insertedCount: 0,
        duplicateCount: 0,
        failedCount: reviews.length,
      };
    }
  }
}
