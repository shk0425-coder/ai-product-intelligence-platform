import { IBaseRepository } from '@/repositories/interfaces/base.repository.js';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
}
