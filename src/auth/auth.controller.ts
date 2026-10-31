import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { type AuthenticatedRequest, AuthResult } from './auth.types.js';
import { type LoginUserInput, loginUserInputSchema } from './dto/login.dto.js';
import { LogoutResponse, logoutResponseSchema } from './dto/logout.dto.js';
import {
  type RegisterUserInput,
  registerUserInputSchema,
} from './dto/register.dto.js';
import { AuthResponse, authResponseSchema } from './dto/shared.dto.js';
import { SessionGuard } from './session.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body({ schema: loginUserInputSchema }) user: LoginUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.loginUser(user);

    return await this.completeAuthentication(res, result);
  }

  @Post('/register')
  async register(
    @Body({ schema: registerUserInputSchema }) user: RegisterUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.registerUser(user);

    return await this.completeAuthentication(res, result);
  }

  @Get('/me')
  @UseGuards(SessionGuard)
  getAuth(@Req() request: AuthenticatedRequest) {
    return {
      userId: request.auth.userId,
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponse> {
    const logoutResponse = await this.authService.logoutUser(
      req.auth.sessionId,
    );

    const parsedResponse = logoutResponseSchema.parse(logoutResponse);
    response.clearCookie('session');
    return parsedResponse;
  }

  private async completeAuthentication(response: Response, result: AuthResult) {
    const body = authResponseSchema.parse({ user: result.user });

    // sets the cookie after authentication
    // (usually after login or registration of account)
    response.cookie('session', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: result.session.expiresAt,
    });

    return body;
  }
}
