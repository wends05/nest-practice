import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AuthResponse,
  AuthResult,
  authResponseSchema,
  type LoginUserInput,
  loginUserInput,
  type RegisterUserInput,
  registerUserInput,
} from './auth.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body({ schema: loginUserInput }) user: LoginUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.loginUser(user);

    return await this.completeAuthentication(res, result);
  }

  @Post('/register')
  async register(
    @Body({ schema: registerUserInput }) user: RegisterUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.registerUser(user);

    return await this.completeAuthentication(res, result);
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
