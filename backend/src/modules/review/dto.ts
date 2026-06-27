export interface CrawlReviewsRequestDto {
  provider: string;
  keyword: string;
}

export interface CrawlReviewsResponseDto {
  provider: string;
  keyword: string;
  insertedCount: number;
  duplicateCount: number;
  failedCount: number;
}
