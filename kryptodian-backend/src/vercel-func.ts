// /vercel-func.js
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// Keep the app instance in memory for subsequent requests
let app;
export default async function handler(req, res) {
  // Bootstrap our NestJS app on cold start
  if (!app) {
    const app: INestApplication = await NestFactory.create(AppModule);
    app.enableVersioning();
    app.useGlobalPipes(new ValidationPipe());
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
      customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js",
      ],
      customCssUrl: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css",
      ],
      swaggerOptions: {
        persistAuthorization: true,
      },
    }); 

    // This is important
    await app.init();
  }
  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();

  instance(req, res);
}