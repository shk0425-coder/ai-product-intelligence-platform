import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { ReviewAnalyzerService } from './service.js';
import { AIController } from './controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { analyzeReviewsSchema } from './schema.js';
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

export default async function aiRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const service = new ReviewAnalyzerService(fastify.supabase);
  const controller = new AIController(service);

  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/analyze', {
    preValidation: validateBody(analyzeReviewsSchema),
    handler: controller.analyze,
  });
}
