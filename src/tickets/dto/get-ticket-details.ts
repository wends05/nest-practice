import z from 'zod';
import { ticketDetailsResponseSchema } from './shared.dto.js';

export const getTicketDetailsParamsSchema = z.string();

export const getTicketDetailsOutputSchema = z.object({
  message: z.string(),
  ticket: ticketDetailsResponseSchema,
});

export type GetTicketDetailsOutput = z.infer<
  typeof getTicketDetailsOutputSchema
>;
