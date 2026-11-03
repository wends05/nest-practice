import z from 'zod';
import { passwordSchema } from './shared.dto.js';

export const updatePasswordInputSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: passwordSchema,
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

export const updatePasswordOutputSchema = z.object({
  message: z.string(),
});

export type UpdatePasswordOutput = z.infer<typeof updatePasswordOutputSchema>;
