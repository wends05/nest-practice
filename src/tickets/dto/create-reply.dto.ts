import z from 'zod';
import { replyMessageSchema, replyResponseSchema } from './shared.dto.js';

export const createReplyParamsSchema = z.string();

export const createReplyInputSchema = z.object({
  message: replyMessageSchema,
});

export type CreateReplyInput = z.infer<typeof createReplyInputSchema>;

export const createReplyOutputSchema = z.object({
  message: z.string(),
  reply: replyResponseSchema,
});

export type CreateReplyOutput = z.infer<typeof createReplyOutputSchema>;
