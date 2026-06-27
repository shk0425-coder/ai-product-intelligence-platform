import Fastify, { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import { loggerConfig } from '@/config/logger.js';
import { errorHandler } from '@/middleware/error-handler.js';
import { API_PREFIX } from '@/common/constants/index.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';
import { successResponse } from '@/common/responses/index.js';

// Import Plugins
import corsPlugin from '@/plugins/cors.js';
import loggerPlugin from '@/plugins/logger.js';
import supabasePlugin from '@/plugins/supabase.js';

// Import Routes
import healthRoutes from '@/routes/v1/health.js';
import authRoutes from '@/modules/auth/route.js';

export const createApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: loggerConfig,
    disableRequestLogging: true, // Custom request logging is handled in loggerPlugin
  });

  // Register Fastify Sensible for HTTP errors and utility responses
  await app.register(sensible);

  // Register Plugins
  await app.register(corsPlugin);
  await app.register(loggerPlugin);
  await app.register(supabasePlugin);

  // Register Global Error Handler
  app.setErrorHandler(errorHandler);

  // Register API Routes
  await app.register(healthRoutes, { prefix: API_PREFIX });
  await app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });

  // Test Protected Route for Verification
  app.get(`${API_PREFIX}/protected`, { preHandler: authMiddleware }, async (request, _reply) => {
    return successResponse({ user: request.user });
  });

  return app;
};
export default createApp;
