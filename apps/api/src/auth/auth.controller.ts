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
import { ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginResponseDto, AuthResponseDto, LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, token: string, expiresAt: Date) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  @Post('register')
  @ApiOkResponse({ type: AuthLoginResponseDto })
  @ApiConflictResponse({ description: 'Email is already registered.' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthLoginResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.authService.register(dto, userAgent, ipAddress);
    this.setRefreshTokenCookie(res, result.refreshToken, result.refreshExpiresAt);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthLoginResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthLoginResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.authService.login(dto, userAgent, ipAddress);
    this.setRefreshTokenCookie(res, result.refreshToken, result.refreshExpiresAt);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Token refreshed successfully.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) {
      this.clearRefreshTokenCookie(res);
      return { accessToken: '' };
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    try {
      const result = await this.authService.refresh(refreshToken, userAgent, ipAddress);
      this.setRefreshTokenCookie(res, result.refreshToken, result.refreshExpiresAt);
      return { accessToken: result.accessToken };
    } catch (error) {
      this.clearRefreshTokenCookie(res);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Logged out successfully.' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies?.['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.clearRefreshTokenCookie(res);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AuthResponseDto })
  getProfile(@Req() req: any): AuthResponseDto {
    return { user: req.user };
  }
}
