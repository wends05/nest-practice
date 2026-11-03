import z from 'zod';
import { paginationOptionsSchema } from '../../common/schema/pagination.schema.js';
import { ticketResponseSchema, ticketStatusSchema } from './shared.dto.js';

export const getAssignedTicketsQuerySchema = paginationOptionsSchema.extend({
  status: ticketStatusSchema.exclude(['OPEN']).optional(),
});

export type GetAssignedTicketsQuery = z.infer<
  typeof getAssignedTicketsQuerySchema
>;

export const getAssignedTicketsOutputSchema = z.object({
  tickets: ticketResponseSchema.array(),
  message: z.string(),
});

export type GetAssignedTicketsOutput = z.infer<
  typeof getAssignedTicketsOutputSchema
>;
