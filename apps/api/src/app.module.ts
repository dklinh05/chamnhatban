import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        PORT: Joi.number().optional(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    ContentModule,
    HealthModule,
  ],
})
export class AppModule {}
