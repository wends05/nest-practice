import z from 'zod';
import { USER_ROLE } from '../../prisma/contract';

export const roleSchema = z.enum(USER_ROLE.members);

export type Role = z.infer<typeof roleSchema>;
