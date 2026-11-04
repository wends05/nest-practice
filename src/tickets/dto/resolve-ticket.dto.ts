import z from 'zod';
import {
  replyMessageSchema,
  ticketResponseSchema,
  ticketStatusSchema,
} from './shared.dto.js';

export const resolveTicketParamsSchema = z.string();

export const allowedResolveTicketStatusSchema = ticketStatusSchema.exclude([
  'ASSIGNED',
  'OPEN',
]);

export type AllowedResolveTicketStatus = z.infer<
  typeof allowedResolveTicketStatusSchema
>;

export const resolveTicketInputSchema = z.object({
  message: replyMessageSchema,
});

export type ResolveTicketInput = z.infer<typeof resolveTicketInputSchema>;

export const resolveTicketOutputSchema = z.object({
  ticket: ticketResponseSchema,
  message: z.string(),
});

export type ResolveTicketOutput = z.infer<typeof resolveTicketOutputSchema>;
