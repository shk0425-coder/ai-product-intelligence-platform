import { IWorkspaceRepository } from './types.js';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto.js';
import { Workspace } from './types.js';
import { PaginationOptions, PaginatedResult } from '@/repositories/interfaces/base.repository.js';
import {
  WorkspaceAlreadyExistsError,
  WorkspaceNotFoundError,
  WorkspaceForbiddenError,
} from '@/common/errors/index.js';

export class WorkspaceService {
  constructor(private readonly workspaceRepository: IWorkspaceRepository) {}

  async create(dto: CreateWorkspaceDto, userId: string): Promise<Workspace> {
    const existing = await this.workspaceRepository.findByName(dto.name);
    if (existing) {
      throw new WorkspaceAlreadyExistsError(`Workspace name "${dto.name}" is already taken`);
    }

    // TODO: Transaction start (Future sprint integration)
    // 1. Create Workspace
    // 2. Create Default settings
    // 3. Create Audit log

    const workspace = await this.workspaceRepository.create({
      name: dto.name,
      org_id: userId,
    });

    // TODO: Audit Hook: Log workspace creation audit event

    return workspace;
  }

  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResult<Workspace>> {
    return this.workspaceRepository.findAllByOwner(userId, options);
  }

  async findById(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new WorkspaceNotFoundError();
    }

    // Verify Owner (GET also verifies owner)
    if (workspace.org_id !== userId) {
      throw new WorkspaceForbiddenError('You do not have permission to access this workspace');
    }

    return workspace;
  }

  async update(id: string, dto: UpdateWorkspaceDto, userId: string): Promise<Workspace> {
    const workspace = await this.findById(id, userId);

    if (dto.name !== workspace.name) {
      const duplicate = await this.workspaceRepository.findByName(dto.name);
      if (duplicate) {
        throw new WorkspaceAlreadyExistsError(`Workspace name "${dto.name}" is already taken`);
      }
    }

    const updated = await this.workspaceRepository.update(id, { name: dto.name });

    // TODO: Audit Hook: Log workspace update audit event

    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);

    await this.workspaceRepository.delete(id);

    // TODO: Audit Hook: Log workspace deletion audit event
  }
}
