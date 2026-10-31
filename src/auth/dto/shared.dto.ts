import z from 'zod';

export const passwordSchema = z.string().min(8).max(30);

export const usernameSchema = z.string().min(5).max(50);

export const nameSchema = z.string().min(5).max(50);

export const publicUserSchema = z.object({
  id: z.uuidv7(),
  username: usernameSchema,
  name: nameSchema,
});

export type PublicUser = z.infer<typeof publicUserSchema>;

// Used for both login and register responses
export const authResponseSchema = z.object({
  user: publicUserSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
