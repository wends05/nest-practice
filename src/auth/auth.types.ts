import { Request } from 'express';
import { Uuid } from '../common/schema/uuid.schema.js';
import { Role } from './dto/role.dto.js';
import { PublicUser } from './dto/shared.dto.js';

export type AuthenticatedRequest = Request & {
  auth: { userId: Uuid; sessionId: Uuid; role: Role };
};

export type Session = { token: string; expiresAt: Date };

export type AuthResult = { user: PublicUser; session: Session };
