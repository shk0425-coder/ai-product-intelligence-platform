import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { MockAuthRepository } from './repository.js';
import { tokenProvider } from '@/utils/jwt.js';
import { AuthService } from './service.js';
import { AuthController } from './controller.js';
import { loginSchema, refreshSchema } from './schema.js';
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

export async function authRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  const repository = new MockAuthRepository();
  const service = new AuthService(repository, tokenProvider);
  const controller = new AuthController(service);

  fastify.post('/login', { preValidation: validateBody(loginSchema) }, controller.login);
  fastify.post('/logout', controller.logout);
  fastify.post('/refresh', { preValidation: validateBody(refreshSchema) }, controller.refresh);
}
export default authRoutes;
