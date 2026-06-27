import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { successResponse } from '@/common/responses/index.js';

export default async function healthRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  fastify.get('/health', async (_request, _reply) => {
    return successResponse({ status: 'ok' });
  });
}
