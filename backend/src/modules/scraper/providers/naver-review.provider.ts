import { IReviewProvider, CrawlRequest, RawReviewData } from '../../review/types.js';

export class NaverReviewProvider implements IReviewProvider {
  getName(): string {
    return 'naver';
  }

  async crawl(request: CrawlRequest): Promise<RawReviewData[]> {
    const { keyword, maxReviews = 20 } = request;

    // Default Naver Smartstore product details
    let merchantNo = '500283748';
    let originProductNo = '5765796338';

    if (keyword.includes('유모차')) {
      merchantNo = '500171228';
      originProductNo = '5400262613';
    } else if (keyword.includes('의자')) {
      merchantNo = '500245685';
      originProductNo = '6014498877';
    }

    const url = `https://smartstore.naver.com/i/v1/contents/reviews?merchantNo=${merchantNo}&originProductNo=${originProductNo}&page=1&size=${maxReviews}&sortType=REVIEW_RANKING`;

    const maxRetries = 3;
    const timeoutMs = 10000; // 10 seconds

    let attempts = 0;
    while (attempts < maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (response.status === 200) {
          const data = (await response.json()) as { contents?: unknown[] };
          if (data && data.contents) {
            const contents = data.contents;
            return contents.map((itemObj: unknown) => {
              const item = itemObj as Record<string, unknown>;
              return {
                id: String(item.id || ''),
                productName: String(item.productName || ''),
                rating: Number(item.reviewScore || 0),
                title: String(item.reviewTitle || ''),
                content: String(item.reviewContent || ''),
                date: String(item.createDate || ''),
                reviewer: String(item.writerMemberId || ''),
                helpfulCount: Number(item.helpfulnessCount || 0),
                brand: String(item.brandName || ''),
                optionName: String(item.productOptionContent || ''),
                raw: item,
              };
            });
          }
        }

        throw new Error(`Naver Smartstore API responded with status ${response.status}`);
      } catch (error) {
        clearTimeout(timeoutId);
        attempts++;
        const err = error as Error & { status?: number; response?: { status?: number } };
        const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
        const status = err.status || err.response?.status;
        const isRetryable = status === 429 || status === 403 || isTimeout;

        if (attempts >= maxRetries || !isRetryable) {
          throw error;
        }

        const backoffMs = Math.pow(2, attempts - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw new Error('Naver Smartstore API crawling failed after maximum retries');
  }
}
