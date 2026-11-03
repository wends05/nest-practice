import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { env } from '../config/env.js';
import { AuthService } from './auth.service.js';
import { type LoginUserInput, loginUserInputSchema } from './dto/login.dto.js';
import { LogoutResponse, logoutResponseSchema } from './dto/logout.dto.js';
import {
  type RegisterUserInput,
  registerUserInputSchema,
} from './dto/register.dto.js';
import {
  type AuthenticatedRequest,
  type AuthResponse,
  AuthResult,
  authResponseSchema,
  authResultSchema,
} from './dto/shared.dto.js';
import {
  type UpdatePasswordInput,
  UpdatePasswordOutput,
  updatePasswordInputSchema,
  updatePasswordOutputSchema,
} from './dto/update-password.dto.js';
import {
  type UpdateUserInput,
  UpdateUserOutput,
  updateUserInputSchema,
  updateUserOutputSchema,
} from './dto/update-user.dto.js';
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

    const authResult = this.completeAuthentication(res, result);

    const parsedResponse = authResponseSchema.parse({
      user: authResult.user,
      message: 'User logged in successfully',
    });
    return parsedResponse;
  }

  @Post('/register')
  async register(
    @Body({ schema: registerUserInputSchema }) user: RegisterUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.registerUser(user);

    const authResult = this.completeAuthentication(res, result);

    const parsedResponse = authResponseSchema.parse({
      user: authResult.user,
      message: 'User registered successfully',
    });
    return parsedResponse;
  }

  @Get('/me')
  @UseGuards(SessionGuard)
  getAuth(@Req() request: AuthenticatedRequest): AuthResponse {
    const { userId, username, name, role } = request.auth;

    const parsedResponse = authResponseSchema.parse({
      user: { id: userId, username, name, role },
      message: 'User retrieved successfully',
    });
    return parsedResponse;
  }

  @Patch('/me')
  @UseGuards(SessionGuard)
  async updateUser(
    @Req() request: AuthenticatedRequest,
    @Body({ schema: updateUserInputSchema }) user: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    const updatedUser = await this.authService.updateUser(
      request.auth.userId,
      user,
    );
    return updateUserOutputSchema.parse({
      user: updatedUser,
      message: 'User updated successfully',
    });
  }

  @Patch('/password')
  @UseGuards(SessionGuard)
  async updatePassword(
    @Req() request: AuthenticatedRequest,
    @Body({ schema: updatePasswordInputSchema }) input: UpdatePasswordInput,
  ): Promise<UpdatePasswordOutput> {
    await this.authService.updatePassword(
      request.auth.userId,
      request.auth.sessionId,
      input,
    );
    return updatePasswordOutputSchema.parse({
      message: 'Password updated successfully',
    });
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

  private completeAuthentication(
    response: Response,
    result: AuthResult,
  ): AuthResult {
    const body = authResultSchema.parse({
      user: result.user,
      session: result.session,
    });

    // sets the cookie after authentication
    // (usually after login or registration of account)
    response.cookie('session', result.session.token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: result.session.expiresAt,
    });

    return body;
  }
}
