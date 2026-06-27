import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '@/common/errors/index.js';
import { errorResponse } from '@/common/responses/index.js';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  // Handle custom application errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(errorResponse(error.code, error.message));
  }

  // Handle Fastify schema validation errors
  if (error.validation) {
    const message = error.validation
      .map((err) => `${err.instancePath || ''} ${err.message}`.trim())
      .join(', ');
    return reply.status(400).send(errorResponse('VALIDATION_ERROR', message));
  }

  // Fallback for generic/internal server errors
  const statusCode = error.statusCode || 500;
  const errorCode = statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : error.code || 'UNKNOWN_ERROR';
  const message = statusCode === 500 ? 'An unexpected error occurred' : error.message;

  return reply.status(statusCode).send(errorResponse(errorCode, message));
};
