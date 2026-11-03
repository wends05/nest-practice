import z from 'zod';
import {
  ticketContentSchema,
  ticketResponseSchema,
  ticketTitleSchema,
} from './shared.dto.js';

export const updateTicketInputSchema = z.object({
  title: ticketTitleSchema.optional(),
  content: ticketContentSchema.optional(),
});

export type UpdateTicketInput = z.infer<typeof updateTicketInputSchema>;

export const updateTicketOutputSchema = z.object({
  ticket: ticketResponseSchema,
  message: z.string(),
});

export type UpdateTicketOutput = z.infer<typeof updateTicketOutputSchema>;
