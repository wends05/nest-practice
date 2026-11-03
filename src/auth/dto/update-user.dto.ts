import z from 'zod';
import { nameSchema, publicUserSchema } from './shared.dto.js';

export const updateUserInputSchema = z.object({
  name: nameSchema,
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUserOutputSchema = z.object({
  user: publicUserSchema,
  message: z.string(),
});
export type UpdateUserOutput = z.infer<typeof updateUserOutputSchema>;
