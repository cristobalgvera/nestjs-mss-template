import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Environment } from './environment';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object<Environment, true>({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(8080),
        ENABLE_SWAGGER: Joi.boolean().default(true),
        FIREBASE_CREDENTIALS: Joi.string().default(''),
        TYPEORM_HOST: Joi.string().default(''),
        TYPEORM_PORT: Joi.number().default(1),
        TYPEORM_USERNAME: Joi.string().default(''),
        TYPEORM_PASSWORD: Joi.string().default(''),
        TYPEORM_DATABASE: Joi.string().default(''),
        TYPEORM_CLOUDSQL: Joi.string().default(''),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
