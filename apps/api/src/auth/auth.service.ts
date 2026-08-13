import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { SessionService } from './session.service';

type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  timezone: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService
  ) {}

  private generateAccessToken(user: AuthUser): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(
    dto: RegisterDto,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: Date;
  }> {
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          displayName: dto.displayName,
          timezone: dto.timezone,
        },
      });

      const authUser = this.toAuthUser(user);
      const accessToken = this.generateAccessToken(authUser);
      const session = await this.sessionService.createSession(user.id, userAgent, ipAddress);

      return {
        user: authUser,
        accessToken,
        refreshToken: session.rawToken,
        refreshExpiresAt: session.expiresAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email is already registered.');
      }

      throw error;
    }
  }

  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: Date;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException('This account has been disabled.');
    }

    const authUser = this.toAuthUser(user);
    const accessToken = this.generateAccessToken(authUser);
    const session = await this.sessionService.createSession(user.id, userAgent, ipAddress);

    return {
      user: authUser,
      accessToken,
      refreshToken: session.rawToken,
      refreshExpiresAt: session.expiresAt,
    };
  }

  async refresh(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string; refreshExpiresAt: Date }> {
    const newSession = await this.sessionService.rotateRefreshToken(
      refreshToken,
      userAgent,
      ipAddress
    );

    const user = await this.prisma.user.findUnique({
      where: { id: newSession.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    const authUser = this.toAuthUser(user);
    const accessToken = this.generateAccessToken(authUser);

    return {
      accessToken,
      refreshToken: newSession.rawToken,
      refreshExpiresAt: newSession.expiresAt,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionService.revokeSessionByToken(refreshToken);
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    displayName: string | null;
    role: UserRole;
    status: UserStatus;
    timezone: string;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      timezone: user.timezone,
    };
  }
}
