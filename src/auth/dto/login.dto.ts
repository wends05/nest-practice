import z from 'zod';
import { passwordSchema, usernameSchema } from './shared.dto.js';

export const loginUserInputSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;
