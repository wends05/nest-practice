import z from 'zod';
import { nameSchema, passwordSchema, usernameSchema } from './shared.dto.js';

export const registerUserInputSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;
