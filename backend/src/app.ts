import Fastify, { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import { loggerConfig } from '@/config/logger.js';
import { errorHandler } from '@/middleware/error-handler.js';
import { API_PREFIX } from '@/common/constants/index.js';

// Import Plugins
import corsPlugin from '@/plugins/cors.js';
import loggerPlugin from '@/plugins/logger.js';
import supabasePlugin from '@/plugins/supabase.js';

// Import Routes
import healthRoutes from '@/routes/v1/health.js';

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

  return app;
};
export default createApp;
