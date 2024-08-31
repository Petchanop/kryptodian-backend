import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { IdPipe } from './auth/id.pipe';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableVersioning();
  const config = new DocumentBuilder()
    .setTitle('Kryptodian')
    .setDescription('Krytodian test API description')
    .setVersion('1.0')
    .addTag('user')
    .addTag('auth')
    .addTag('profile')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',)
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: '/api/kryptodian_openapi.json',
    yamlDocumentUrl: '/api/kryptodian_openapi.yaml',
  });
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
