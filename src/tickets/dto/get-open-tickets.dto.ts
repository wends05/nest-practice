import z from 'zod';
import { ticketResponseSchema } from './shared.dto.js';

export const getOpenTicketsOutputSchema = z.object({
  tickets: ticketResponseSchema.array(),
  message: z.string(),
});

export type GetOpenTicketsOutput = z.infer<typeof getOpenTicketsOutputSchema>;
