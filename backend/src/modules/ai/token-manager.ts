import { PromptBuilder } from './prompt-builder.js';

export interface RawReviewRecord {
  raw_text: string;
  rating: number;
  collected_at?: string;
}

export class TokenManager {
  private static CHAR_TO_TOKEN_RATIO = 3;

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / this.CHAR_TO_TOKEN_RATIO);
  }

  static truncateReviews(
    reviews: RawReviewRecord[],
    maxTokens: number,
    keyword: string
  ): RawReviewRecord[] {
    const sortedReviews = [...reviews].sort((a, b) => {
      const dateA = a.collected_at ? new Date(a.collected_at).getTime() : 0;
      const dateB = b.collected_at ? new Date(b.collected_at).getTime() : 0;
      return dateB - dateA;
    });

    const acceptedReviews: RawReviewRecord[] = [];

    for (const review of sortedReviews) {
      const candidateReviews = [...acceptedReviews, review];
      const candidatePrompt = PromptBuilder.build(candidateReviews, keyword);
      const estimatedTokens = this.estimateTokens(candidatePrompt);

      if (estimatedTokens > maxTokens) {
        break;
      }
      acceptedReviews.push(review);
    }

    return acceptedReviews;
  }
}
