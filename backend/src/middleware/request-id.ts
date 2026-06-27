import { FastifyReply, FastifyRequest } from 'fastify';

export const requestIdHook = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.header('x-request-id', request.id);
};
