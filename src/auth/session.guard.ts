import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { uuidSchema } from '../common/schema/uuid.schema.js';
import { SessionInvalidError } from './auth.errors.js';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from './auth.types.js';
import { roleSchema } from './dto/role.dto.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies.session;

    if (typeof token !== 'string' || !token?.trim() || token.length === 0) {
      throw new SessionInvalidError();
    }

    const session = await this.authService.validateSession(token);

    if (!session) {
      throw new SessionInvalidError();
    }

    const parsedUserId = uuidSchema.parse(session.userId);
    const parsedUserRole = roleSchema.parse(session.user?.role);
    request.auth = {
      userId: parsedUserId,
      sessionId: session.id,
      role: parsedUserRole,
    };

    return true;
  }
}
