import { FastifyReply, FastifyRequest } from 'fastify';
import { ReviewAnalyzerService } from './service.js';
import { AnalyzeReviewsInput } from './schema.js';
import { successResponse } from '../../common/responses/index.js';

export class AIController {
  constructor(private readonly analyzerService: ReviewAnalyzerService) {}

  analyze = async (
    request: FastifyRequest<{ Body: AnalyzeReviewsInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { provider, keyword, maxReviews = 100 } = request.body;
    const result = await this.analyzerService.analyzeReviews(provider, keyword, maxReviews);

    return reply.status(200).send(
      successResponse(
        {
          reviewCount: maxReviews,
          ...result,
        },
        'Analysis completed'
      )
    );
  };
}
