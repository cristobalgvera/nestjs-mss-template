import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getLogger } from './utils/logger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { EnvironmentService } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Add proper global prefix
  app.setGlobalPrefix('SERVICE_PREFIX');
  app.enableVersioning();
  app.enableCors();

  const environmentService = app.get(EnvironmentService);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: environmentService.isProd,
    }),
  );

  app.useLogger(
    WinstonModule.createLogger({
      instance: getLogger(environmentService.isProd),
    }),
  );

  const logger = app.get(Logger);
  const port = environmentService.getEnvironmentValue('PORT');

  if (environmentService.isSwaggerEnabled) enableSwagger(app, port, logger);

  await app.listen(port, () => {
    logger.log(`Listening on port ${port}`);
  });
}

function enableSwagger(app: INestApplication, port: number, logger: Logger) {
  const config = new DocumentBuilder()
    // TODO: add proper service name
    .setTitle('SERVICE_NAME')
    .setDescription('SERVICE_DESCRIPTION')
    .setVersion('1.0')
    .setExternalDoc('Postman collection', '/api-json')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  logger.log(`[Swagger URL]: http://localhost:${port}/api-doc`);
  logger.log(`[Postman JSON]: http://localhost:${port}/api-doc-json`);

  SwaggerModule.setup('api-doc', app, document);
}

bootstrap();
