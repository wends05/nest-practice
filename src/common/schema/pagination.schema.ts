import z from 'zod';

export const paginationOptionsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  offset: z.coerce.number().nonnegative().default(0),
});

export type PaginationOptions = z.infer<typeof paginationOptionsSchema>;
