import { FastifyReply, FastifyRequest } from 'fastify';
import { MarketService } from './service.js';
import { MarketQueryInput, MarketIdParamInput, CreateMarketMetricInput, UpdateMarketMetricInput } from './schema.js';
import { toResponseDto } from './dto.js';
import { successResponse } from '@/common/responses/index.js';

export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  findAll = async (
    request: FastifyRequest<{ Querystring: MarketQueryInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const paginated = await this.marketService.findAll(userId, request.query);
    const result = {
      ...paginated,
      data: paginated.data.map(toResponseDto),
    };
    return reply.status(200).send(successResponse(result));
  };

  findById = async (
    request: FastifyRequest<{ Params: MarketIdParamInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const metric = await this.marketService.findById(request.params.id, userId);
    return reply.status(200).send(successResponse(toResponseDto(metric)));
  };

  create = async (
    request: FastifyRequest<{ Body: CreateMarketMetricInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const metric = await this.marketService.create(request.body, userId);
    return reply.status(201).send(successResponse(toResponseDto(metric), 'Market metric created successfully'));
  };

  update = async (
    request: FastifyRequest<{ Params: MarketIdParamInput; Body: UpdateMarketMetricInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    const metric = await this.marketService.update(request.params.id, request.body, userId);
    return reply.status(200).send(successResponse(toResponseDto(metric), 'Market metric updated successfully'));
  };

  delete = async (
    request: FastifyRequest<{ Params: MarketIdParamInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const userId = request.user!.userId;
    await this.marketService.delete(request.params.id, userId);
    return reply.status(200).send(successResponse(null, 'Market metric deleted successfully'));
  };
}
