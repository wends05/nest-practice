// src/common/errors/error-codes.ts

import { AUTH_ERROR_CODE } from '../../auth/auth.errors.js';

export const ERROR_CODE = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  ...AUTH_ERROR_CODE,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
