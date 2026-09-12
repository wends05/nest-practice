import z from 'zod';
import type { FieldOutputTypes } from '../../prisma/contract.d.js';

// UUID string fields share the contract's Char<36> representation.
export type Uuid = FieldOutputTypes['public']['User']['id'];

// Validate external IDs before assigning the contract's branded type.
export const uuidSchema = z
  .uuid({ version: 'v7' })
  .transform((value): Uuid => value as Uuid);
