import z from 'zod';
import { uuidSchema } from '../../common/schema/uuid.schema.js';
import { TICKET_STATUS } from '../../prisma/contract.js';

export const ticketTitleSchema = z.string().min(1).max(100);

export const ticketContentSchema = z.string().max(200);

export const ticketStatusSchema = z.enum(TICKET_STATUS.members);

export const replyMessageSchema = z.string().trim().min(1).max(2000);

export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export const ticketResponseSchema = z.object({
  id: uuidSchema,
  title: ticketTitleSchema,
  status: ticketStatusSchema,
});

export type TicketResponse = z.infer<typeof ticketResponseSchema>;

// Ticket user details schema
export const ticketUserDetailsSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  username: z.string(),
});

// Reply related schemas
export const replyResponseSchema = z.object({
  id: uuidSchema,
  message: replyMessageSchema,
  createdAt: z.iso.datetime(),
  author: ticketUserDetailsSchema,
});

export type ReplyResponse = z.infer<typeof replyResponseSchema>;

export type TicketUserDetails = z.infer<typeof ticketUserDetailsSchema>;

export const ticketDetailsResponseSchema = ticketResponseSchema.extend({
  owner: ticketUserDetailsSchema,
  resolver: ticketUserDetailsSchema.nullable(),
  content: ticketContentSchema,
  replies: replyResponseSchema.array(),
});

export type TicketDetailsResponse = z.infer<typeof ticketDetailsResponseSchema>;

// Ticket Filters
export const ticketFilterQuerySchema = z.object({
  status: ticketStatusSchema.optional(),
});

export type TicketFilterQuery = z.infer<typeof ticketFilterQuerySchema>;
