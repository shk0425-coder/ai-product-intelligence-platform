import { SupabaseClient } from '@supabase/supabase-js';
import { IBaseRepository, PaginationOptions, PaginatedResult } from '../interfaces/base.repository.js';
import { DatabaseError } from '@/common/errors/index.js';

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly tableName: string,
    protected readonly primaryKeyName: string = 'id'
  ) {}

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq(this.primaryKeyName, id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(error.message);
    }
    return data as T | null;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: inserted, error } = await this.supabase
      .from(this.tableName)
      .insert(data as Record<string, unknown>)
      .select('*')
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }
    return inserted as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(data as Record<string, unknown>)
      .eq(this.primaryKeyName, id)
      .select('*')
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }
    return updated as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString() } as Record<string, unknown>)
      .eq(this.primaryKeyName, id)
      .select()
      .maybeSingle();

    if (error) {
      throw new DatabaseError(error.message);
    }
  }

  async exists(id: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq(this.primaryKeyName, id)
      .is('deleted_at', null);

    if (error) {
      throw new DatabaseError(error.message);
    }
    return (count ?? 0) > 0;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<T>> {
    const { page, limit, sort, order } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order(sort, { ascending: order === 'asc' })
      .range(from, to);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return {
      data: (data ?? []) as T[],
      total: count ?? 0,
      page,
      limit,
    };
  }
}
export default BaseRepository;
