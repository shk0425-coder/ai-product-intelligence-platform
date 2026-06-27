import { FastifyReply, FastifyRequest } from 'fastify';

export const loggingHook = async (request: FastifyRequest) => {
  request.log.info({
    msg: 'incoming request',
    method: request.method,
    url: request.url,
    requestId: request.id,
  });
};

export const responseLoggingHook = async (request: FastifyRequest, reply: FastifyReply) => {
  const duration = request.startTime ? Date.now() - request.startTime : undefined;
  request.log.info({
    msg: 'request completed',
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    durationMs: duration,
    requestId: request.id,
  });
};
