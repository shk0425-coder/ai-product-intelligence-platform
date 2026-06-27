import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkspaceService } from './service.js';
import { CreateWorkspaceInput, UpdateWorkspaceInput, WorkspaceQueryInput, WorkspaceIdParamInput } from './schema.js';
import { toResponseDto } from './dto.js';
import { successResponse } from '@/common/responses/index.js';

export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateWorkspaceInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const workspace = await this.workspaceService.create(request.body, userId);
    return reply.status(201).send(successResponse(toResponseDto(workspace), 'Workspace created successfully'));
  };

  findAll = async (
    request: FastifyRequest<{ Querystring: WorkspaceQueryInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const paginated = await this.workspaceService.findAll(userId, request.query);
    const result = {
      ...paginated,
      data: paginated.data.map(toResponseDto),
    };
    return reply.status(200).send(successResponse(result));
  };

  findById = async (
    request: FastifyRequest<{ Params: WorkspaceIdParamInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const workspace = await this.workspaceService.findById(request.params.id, userId);
    return reply.status(200).send(successResponse(toResponseDto(workspace)));
  };

  update = async (
    request: FastifyRequest<{ Params: WorkspaceIdParamInput; Body: UpdateWorkspaceInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const workspace = await this.workspaceService.update(request.params.id, request.body, userId);
    return reply.status(200).send(successResponse(toResponseDto(workspace), 'Workspace updated successfully'));
  };

  delete = async (
    request: FastifyRequest<{ Params: WorkspaceIdParamInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    await this.workspaceService.delete(request.params.id, userId);
    return reply.status(200).send(successResponse(null, 'Workspace deleted successfully'));
  };
}
