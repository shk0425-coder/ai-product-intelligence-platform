import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { ReviewRepository } from './repository.js';
import { ReviewService } from './service.js';
import { ReviewController } from './controller.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';
import { crawlReviewsSchema } from './schema.js';
import { ValidationError } from '@/common/errors/index.js';
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

export default async function reviewRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const repository = new ReviewRepository(fastify.supabase);
  const service = new ReviewService(repository);
  const controller = new ReviewController(service);

  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/crawl', {
    preValidation: validateBody(crawlReviewsSchema),
    handler: controller.crawl,
  });
}
