import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './service.js';
import { LoginInput, RefreshInput } from './schema.js';
import { successResponse } from '@/common/responses/index.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const result = await this.authService.login(request.body);
    return reply.status(200).send(successResponse(result, 'Login successful'));
  };

  refresh = async (
    request: FastifyRequest<{ Body: RefreshInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const result = await this.authService.refresh(request.body.refreshToken);
    return reply.status(200).send(successResponse(result));
  };

  logout = async (
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    await this.authService.logout();
    return reply.status(200).send(successResponse(null, 'Logout successful'));
  };
}
