import z from 'zod';

export const passwordSchema = z.string().min(8).max(30);

export const usernameSchema = z.string().min(5).max(50);

export const nameInput = z.string().min(5).max(50);

export const registerUserInput = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameInput,
});

export type RegisterUserInput = z.infer<typeof registerUserInput>;

export const loginUserInput = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginUserInput = z.infer<typeof loginUserInput>;

export const sessionSchema = z.object({
  token: z.string(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

export const publicUserSchema = z.object({
  id: z.uuidv7(),
  username: usernameSchema,
  name: nameInput,
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const authResultSchema = z.object({
  user: publicUserSchema,
  session: sessionSchema,
});

export type AuthResult = z.infer<typeof authResultSchema>;

export const authResponseSchema = z.object({
  user: publicUserSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
