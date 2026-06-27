import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { WorkspaceRepository } from './repository.js';
import { WorkspaceService } from './service.js';
import { WorkspaceController } from './controller.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdParamSchema,
  workspaceQuerySchema,
} from './schema.js';
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

export default async function workspaceRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const repository = new WorkspaceRepository(fastify.supabase);
  const service = new WorkspaceService(repository);
  const controller = new WorkspaceController(service);

  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/', {
    preValidation: validateBody(createWorkspaceSchema),
    handler: controller.create,
  });

  fastify.get('/', {
    preValidation: validateQuery(workspaceQuerySchema),
    handler: controller.findAll,
  });

  fastify.get('/:id', {
    preValidation: validateParams(workspaceIdParamSchema),
    handler: controller.findById,
  });

  fastify.patch('/:id', {
    preValidation: [validateParams(workspaceIdParamSchema), validateBody(updateWorkspaceSchema)],
    handler: controller.update,
  });

  fastify.delete('/:id', {
    preValidation: validateParams(workspaceIdParamSchema),
    handler: controller.delete,
  });
}
