import z from 'zod';

export const deleteTicketParamsSchema = z.string();

export const deleteTicketOutputSchema = z.object({
  message: z.string(),
});
export type DeleteTicketOutput = z.infer<typeof deleteTicketOutputSchema>;
