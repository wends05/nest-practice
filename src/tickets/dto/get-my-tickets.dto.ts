import z from 'zod';
import { paginationOptionsSchema } from '../../common/schema/pagination.schema.js';
import { ticketFilterQuerySchema, ticketResponseSchema } from './shared.dto.js';

export const getMyTicketsQuerySchema = paginationOptionsSchema.extend(
  ticketFilterQuerySchema.shape,
);
export type GetMyTicketsQuery = z.infer<typeof getMyTicketsQuerySchema>;

export const getMyTicketsOutputSchema = z.object({
  message: z.string(),
  tickets: z.array(ticketResponseSchema),
});

export type GetMyTicketsOutput = z.infer<typeof getMyTicketsOutputSchema>;
