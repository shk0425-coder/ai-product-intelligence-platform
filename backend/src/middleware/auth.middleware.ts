import { FastifyReply, FastifyRequest } from 'fastify';
import { tokenProvider } from '@/utils/jwt.js';
import { UnauthorizedError } from '@/common/errors/index.js';

export const authMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);

  // verifyAccessToken will validate signature and expiry, throwing ExpiredTokenError or InvalidTokenError
  const decoded = tokenProvider.verifyAccessToken(token);

  request.user = decoded;
};
