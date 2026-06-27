import { FastifyReply, FastifyRequest } from 'fastify';
import { ReviewService } from './service.js';
import { CrawlReviewsInput } from './schema.js';
import { successResponse } from '@/common/responses/index.js';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  crawl = async (
    request: FastifyRequest<{ Body: CrawlReviewsInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { provider, keyword } = request.body;
    const result = await this.reviewService.crawl(provider, keyword);

    return reply.status(200).send(
      successResponse(
        {
          provider,
          keyword,
          insertedCount: result.insertedCount,
          duplicateCount: result.duplicateCount,
          failedCount: result.failedCount,
        },
        'Successfully crawled reviews'
      )
    );
  };
}
