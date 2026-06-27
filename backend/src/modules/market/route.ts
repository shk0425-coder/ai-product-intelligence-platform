import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { MarketRepository } from './repository.js';
import { MarketService } from './service.js';
import { MarketController } from './controller.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';
import { marketIdParamSchema, marketQuerySchema, createMarketMetricSchema, updateMarketMetricSchema } from './schema.js';
import { ValidationError } from '@/common/errors/index.js';
import { z } from 'zod';

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

export default async function marketRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const repository = new MarketRepository(fastify.supabase);
  const service = new MarketService(repository);
  const controller = new MarketController(service);

  fastify.addHook('preHandler', authMiddleware);

  fastify.get('/', {
    preValidation: validateQuery(marketQuerySchema),
    handler: controller.findAll,
  });

  fastify.get('/:id', {
    preValidation: validateParams(marketIdParamSchema),
    handler: controller.findById,
  });

  fastify.post('/', {
    preValidation: validateBody(createMarketMetricSchema),
    handler: controller.create,
  });

  fastify.patch('/:id', {
    preValidation: [validateParams(marketIdParamSchema), validateBody(updateMarketMetricSchema)],
    handler: controller.update,
  });

  fastify.delete('/:id', {
    preValidation: validateParams(marketIdParamSchema),
    handler: controller.delete,
  });
}
