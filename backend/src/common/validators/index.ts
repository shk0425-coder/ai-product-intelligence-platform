import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
