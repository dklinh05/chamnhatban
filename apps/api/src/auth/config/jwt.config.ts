import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret-change-in-production',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
}));
