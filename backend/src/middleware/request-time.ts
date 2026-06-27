import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

export const requestTimeHook = async (request: FastifyRequest) => {
  request.startTime = Date.now();
};
