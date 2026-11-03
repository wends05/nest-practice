import { Request } from 'express';
import z from 'zod';
import { uuidSchema } from '../../common/schema/uuid.schema.js';
import { roleSchema } from './role.dto.js';

export const passwordSchema = z.string().min(8).max(30);

export const usernameSchema = z.string().min(5).max(50);

export const nameSchema = z.string().min(5).max(50);

export const publicUserSchema = z.object({
  id: z.uuidv7(),
  username: usernameSchema,
  name: nameSchema,
  role: roleSchema,
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const sessionSchema = z.object({
  token: z.string(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

// Used for both login and register responses
export const authResultSchema = z.object({
  user: publicUserSchema,
  session: sessionSchema,
});
export type AuthResult = z.infer<typeof authResultSchema>;

export const authResponseSchema = z.object({
  user: publicUserSchema,
  message: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const authContextSchema = z.object(
  publicUserSchema
    .pick({
      username: true,
      name: true,
      role: true,
    })
    .extend({
      sessionId: uuidSchema,
      userId: uuidSchema,
    }).shape,
);

export type AuthContext = z.infer<typeof authContextSchema>;
export type AuthenticatedRequest = { auth: AuthContext } & Request;
