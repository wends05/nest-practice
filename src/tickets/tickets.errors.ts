import { HttpStatus } from '@nestjs/common';
import { AppException } from '../common/errors/app.exception';

export const TICKET_ERROR_CODE = {
  NOT_FOUND: 'TICKET_NOT_FOUND',
  TICKET_OWNED: 'TICKET_OWNED',
  TICKET_NOT_OWNED: 'TICKET_NOT_OWNED',
  TICKET_NOT_EDITABLE: 'TICKET_NOT_EDITABLE',
  TICKET_ALREADY_ACCEPTED: 'TICKET_ALREADY_ACCEPTED',
} as const;

export class TicketNotFoundException extends AppException {
  constructor(customMessage?: string) {
    super(
      HttpStatus.NOT_FOUND,
      TICKET_ERROR_CODE.NOT_FOUND,
      customMessage ?? 'This ticket does not exist or may have been deleted.',
    );
  }
}

export class TicketOwnedException extends AppException {
  constructor(customMessage?: string) {
    super(
      HttpStatus.FORBIDDEN,
      TICKET_ERROR_CODE.TICKET_OWNED,
      customMessage ?? 'You cannot accept your own ticket.',
    );
  }
}

export class TicketNotOwnedException extends AppException {
  constructor(customMessage?: string) {
    super(
      HttpStatus.FORBIDDEN,
      TICKET_ERROR_CODE.TICKET_NOT_OWNED,
      customMessage ?? 'You do not own this ticket.',
    );
  }
}

export class TicketNotEditableException extends AppException {
  constructor(customMessage?: string) {
    super(
      HttpStatus.CONFLICT,
      TICKET_ERROR_CODE.TICKET_NOT_EDITABLE,
      customMessage ?? 'Ticket is not editable.',
    );
  }
}

export class TicketAlreadyAcceptedException extends AppException {
  constructor(customMessage?: string) {
    super(
      HttpStatus.CONFLICT,
      TICKET_ERROR_CODE.TICKET_ALREADY_ACCEPTED,
      customMessage ?? 'Ticket is already accepted by someone else.',
    );
  }
}
