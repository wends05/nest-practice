import { HttpStatus } from '@nestjs/common';
import { AppException } from '../common/errors/app.exception.js';

export const AUTH_ERROR_CODE = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_EXISTS: 'USER_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  SESSION_INVALID: 'SESSION_INVALID',
  PASSWORD_UNCHANGED: 'PASSWORD_UNCHANGED',
  INVALID_CURRENT_PASSWORD: 'INVALID_CURRENT_PASSWORD',
} as const;

export class InvalidCredentialsError extends AppException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      AUTH_ERROR_CODE.INVALID_CREDENTIALS,
      'Invalid credentials',
    );
  }
}

export class UserExistsError extends AppException {
  constructor() {
    super(
      HttpStatus.CONFLICT,
      AUTH_ERROR_CODE.USER_EXISTS,
      'User already exists',
    );
  }
}

export class UserNotFoundError extends AppException {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      AUTH_ERROR_CODE.USER_NOT_FOUND,
      'User not found',
    );
  }
}

export class SessionInvalidError extends AppException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      AUTH_ERROR_CODE.SESSION_INVALID,
      'Session invalid',
    );
  }
}

export class PasswordUnchangedError extends AppException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODE.PASSWORD_UNCHANGED,
      'Password unchanged',
    );
  }
}

export class InvalidCurrentPasswordError extends AppException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODE.INVALID_CURRENT_PASSWORD,
      'Invalid current password',
    );
  }
}
