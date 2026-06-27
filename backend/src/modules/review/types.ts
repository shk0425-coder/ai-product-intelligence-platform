export interface ReviewDto {
  provider: string;
  keyword: string;
  reviewId: string;
  providerProductId: string;
  providerReviewId: string;
  productName: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  reviewer: string;
  reviewDate: string;
  helpfulCount: number;
  brand: string;
  optionName: string;
  collectedAt: string;
  metadata: Record<string, unknown>;
}

export interface BulkInsertResult {
  insertedCount: number;
  duplicateCount: number;
  failedCount: number;
}

export interface IReviewRepository {
  bulkInsert(reviews: ReviewDto[]): Promise<BulkInsertResult>;
}

export interface CrawlRequest {
  keyword: string;
  maxReviews?: number;
  sort?: "latest" | "best";
}

export interface RawReviewData {
  id: string;
  productName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  reviewer: string;
  helpfulCount: number;
  brand?: string;
  optionName?: string;
  raw: Record<string, unknown>;
}

export interface IReviewProvider {
  getName(): string;
  crawl(request: CrawlRequest): Promise<RawReviewData[]>;
}
