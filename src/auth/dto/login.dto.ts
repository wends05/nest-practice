import z from 'zod';
import { passwordSchema, usernameSchema } from './shared.dto.js';

export const loginUserInput = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginUserInput = z.infer<typeof loginUserInput>;
