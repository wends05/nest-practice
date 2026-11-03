import z from 'zod';
import { usernameSchema } from './shared.dto.js';

export const loginUserInputSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1).max(256),
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;
