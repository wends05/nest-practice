import z from 'zod';
import {
  ticketContentSchema,
  ticketResponseSchema,
  ticketTitleSchema,
} from './shared.dto';

export const createTicketInputSchema = z.object({
  title: ticketTitleSchema,
  content: ticketContentSchema,
});

export type CreateTicketInput = z.infer<typeof createTicketInputSchema>;

export const createTicketOutputSchema = z.object({
  ticket: ticketResponseSchema,
  message: z.string(),
});

export type CreateTicketOutput = z.infer<typeof createTicketOutputSchema>;
