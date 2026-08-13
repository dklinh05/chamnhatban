import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '../../auth/auth.types';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { role?: UserRole };
    }>();

    if (request.user?.role === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException('Admin role is required.');
  }
}
