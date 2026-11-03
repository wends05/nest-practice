// src/common/errors/error-codes.ts

import { AUTH_ERROR_CODE } from '../../auth/auth.errors.js';
import { TICKET_ERROR_CODE } from '../../tickets/tickets.errors.js';

export const ERROR_CODE = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  BAD_REQUEST: 'BAD_REQUEST',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  REQUEST_FAILED: 'REQUEST_FAILED',
  ...AUTH_ERROR_CODE,
  ...TICKET_ERROR_CODE,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
