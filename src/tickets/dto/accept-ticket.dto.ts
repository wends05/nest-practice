import z from 'zod';
import { ticketResponseSchema } from './shared.dto.js';

export const acceptTicketParamsSchema = z.string();

export const acceptTicketOutputSchema = z.object({
  ticket: ticketResponseSchema,
  message: z.string(),
});

export type AcceptTicketOutput = z.infer<typeof acceptTicketOutputSchema>;
