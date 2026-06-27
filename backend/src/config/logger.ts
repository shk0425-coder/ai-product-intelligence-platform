import pino from 'pino';
import { env } from '@/config/env.js';

export const loggerConfig = {
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
};

export const logger = pino(loggerConfig);
