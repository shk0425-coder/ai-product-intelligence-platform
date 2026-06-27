import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { requestIdHook } from '@/middleware/request-id.js';
import { requestTimeHook } from '@/middleware/request-time.js';
import { loggingHook, responseLoggingHook } from '@/middleware/logging.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', requestTimeHook);
  fastify.addHook('onRequest', requestIdHook);
  fastify.addHook('onRequest', loggingHook);
  fastify.addHook('onResponse', responseLoggingHook);
});
