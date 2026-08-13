import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ rawToken: string; expiresAt: Date }> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = this.hashToken(rawToken);

    // Default refresh token life: 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.authSession.create({
      data: {
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return { rawToken, expiresAt };
  }

  async validateRefreshToken(rawToken: string): Promise<{ userId: string; sessionId: string }> {
    const refreshTokenHash = this.hashToken(rawToken);

    const session = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (session.revokedAt) {
      // Reuse detected: revoke all active sessions for safety
      await this.revokeAllUserSessions(session.userId);
      throw new UnauthorizedException('Refresh token has already been used.');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    if (session.user.status === 'DISABLED') {
      throw new UnauthorizedException('User is disabled.');
    }

    return { userId: session.userId, sessionId: session.id };
  }

  async rotateRefreshToken(
    rawToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ rawToken: string; expiresAt: Date; userId: string }> {
    const { userId, sessionId } = await this.validateRefreshToken(rawToken);

    // Revoke the old session
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    // Create a new session
    const session = await this.createSession(userId, userAgent, ipAddress);
    return {
      rawToken: session.rawToken,
      expiresAt: session.expiresAt,
      userId,
    };
  }

  async revokeSessionByToken(rawToken: string): Promise<void> {
    const refreshTokenHash = this.hashToken(rawToken);
    const session = await this.prisma.authSession.findUnique({
      where: { refreshTokenHash },
    });

    if (session) {
      await this.prisma.authSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
