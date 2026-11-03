import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionInvalidError } from './auth.errors.js';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest, authContextSchema } from './dto/shared.dto.js';

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

    request.auth = authContextSchema.parse({
      user: session.user,
      userId: session.user?.id,
      sessionId: session.id,
      role: session.user?.role,
      name: session.user?.name,
      username: session.user?.username,
    });

    return true;
  }
}
