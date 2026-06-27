import { FastifyReply, FastifyRequest } from 'fastify';
import { ReviewAnalysisPersistenceService } from './persistence-service.js';
import { ReviewAnalysisQueryService } from './query-service.js';
import { AnalyzeReviewsInput, GetLatestAnalysisInput, GetByIdParamsInput } from './schema.js';
import { successResponse } from '../../common/responses/index.js';
import { NotFoundError } from '../../common/errors/index.js';

export class AIController {
  constructor(
    private readonly persistenceService: ReviewAnalysisPersistenceService,
    private readonly queryService: ReviewAnalysisQueryService
  ) {}

  analyze = async (
    request: FastifyRequest<{ Body: AnalyzeReviewsInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { provider, keyword, maxReviews = 100 } = request.body;
    const { cached, data } = await this.persistenceService.analyzeAndPersist(
      provider,
      keyword,
      maxReviews
    );

    return reply.status(200).send(
      successResponse(
        {
          cached,
          ...data,
        },
        'Analysis processed'
      )
    );
  };

  getLatest = async (
    request: FastifyRequest<{ Querystring: GetLatestAnalysisInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { provider, keyword } = request.query;
    const result = await this.queryService.getLatestAnalysis(provider, keyword);
    if (!result) {
      throw new NotFoundError(`No analysis results found for provider '${provider}' and keyword '${keyword}'`);
    }

    return reply.status(200).send(
      successResponse(
        result,
        'Latest analysis retrieved'
      )
    );
  };

  getById = async (
    request: FastifyRequest<{ Params: GetByIdParamsInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    const result = await this.queryService.getAnalysisById(id);
    if (!result) {
      throw new NotFoundError(`Analysis result with id '${id}' not found`);
    }

    return reply.status(200).send(
      successResponse(
        result,
        'Analysis retrieved'
      )
    );
  };
}
