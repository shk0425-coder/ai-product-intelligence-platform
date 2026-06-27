import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { ReviewAnalyzerService } from './service.js';
import { ReviewAnalysisPersistenceService } from './persistence-service.js';
import { ReviewAnalysisQueryService } from './query-service.js';
import { AIController } from './controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { analyzeReviewsSchema, getLatestAnalysisSchema, getByIdParamsSchema } from './schema.js';
import { ValidationError } from '../../common/errors/index.js';
import { z } from 'zod';

const validateBody = <T extends z.ZodTypeAny>(schema: T) => async (request: FastifyRequest) => {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new ValidationError(message);
  }
  request.body = result.data;
};

const validateQuery = <T extends z.ZodTypeAny>(schema: T) => async (request: FastifyRequest) => {
  const result = schema.safeParse(request.query);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new ValidationError(message);
  }
  request.query = result.data;
};

const validateParams = <T extends z.ZodTypeAny>(schema: T) => async (request: FastifyRequest) => {
  const result = schema.safeParse(request.params);
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new ValidationError(message);
  }
  request.params = result.data;
};

export default async function aiRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const analyzerService = new ReviewAnalyzerService(fastify.supabase);
  const persistenceService = new ReviewAnalysisPersistenceService(fastify.supabase, analyzerService);
  const queryService = new ReviewAnalysisQueryService(fastify.supabase);
  const controller = new AIController(persistenceService, queryService);

  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/analyze', {
    preValidation: validateBody(analyzeReviewsSchema),
    handler: controller.analyze,
  });

  fastify.get('/analysis', {
    preValidation: validateQuery(getLatestAnalysisSchema),
    handler: controller.getLatest,
  });

  fastify.get('/analysis/:id', {
    preValidation: validateParams(getByIdParamsSchema),
    handler: controller.getById,
  });
}
