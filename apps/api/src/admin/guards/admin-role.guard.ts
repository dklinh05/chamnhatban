import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { role?: UserRole };
    }>();

    if (request.user?.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('Admin role is required.');
  }
}
