import z from 'zod';
import { nameInput, passwordSchema, usernameSchema } from './shared.dto.js';

export const registerUserInput = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameInput,
});

export type RegisterUserInput = z.infer<typeof registerUserInput>;
