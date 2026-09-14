import { Request } from 'express';
import { Uuid } from '../common/schema/uuid.schema.js';
import { PublicUser } from './dto/shared.dto.js';

export type AuthenticatedRequest = Request & {
  auth: { userId: string; sessionId: Uuid };
};

export type Session = { token: string; expiresAt: Date };

export type AuthResult = { user: PublicUser; session: Session };
