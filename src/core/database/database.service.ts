import { EnvironmentService } from '@core/environment';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConnection implements TypeOrmOptionsFactory {
  constructor(private environmentService: EnvironmentService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return !this.environmentService.isProd || this.environmentService.isTest
      ? {
          type: 'mysql',
          host: this.environmentService.getEnvironmentValue('TYPEORM_HOST'),
          port:
            this.environmentService.getEnvironmentValue('TYPEORM_PORT') || 3306,
          username:
            this.environmentService.getEnvironmentValue('TYPEORM_USERNAME'),
          password:
            this.environmentService.getEnvironmentValue('TYPEORM_PASSWORD'),
          database:
            this.environmentService.getEnvironmentValue('TYPEORM_DATABASE'),
          entities: this.environmentService.isTest
            ? ['src/entities/**/*.entity{.ts,.js}']
            : ['dist/entities/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
        }
      : {
          type: 'mysql',
          host: this.environmentService.getEnvironmentValue('TYPEORM_CLOUDSQL'),
          port:
            this.environmentService.getEnvironmentValue('TYPEORM_PORT') || 3306,
          username:
            this.environmentService.getEnvironmentValue('TYPEORM_USERNAME'),
          password:
            this.environmentService.getEnvironmentValue('TYPEORM_PASSWORD'),
          database:
            this.environmentService.getEnvironmentValue('TYPEORM_DATABASE'),
          entities: ['dist/entities/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
          extra: {
            socketPath:
              this.environmentService.getEnvironmentValue('TYPEORM_CLOUDSQL'),
          },
        };
  }
}
