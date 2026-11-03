import z from 'zod';
import { ticketReplySchema, ticketResponseSchema } from './shared.dto.js';

export const resolveTicketParamsSchema = z.string();

export const resolveTicketInputSchema = z.object({
  reply: ticketReplySchema,
});

export type ResolveTicketInput = z.infer<typeof resolveTicketInputSchema>;

export const resolveTicketOutputSchema = z.object({
  ticket: ticketResponseSchema,
  message: z.string(),
});

export type ResolveTicketOutput = z.infer<typeof resolveTicketOutputSchema>;
