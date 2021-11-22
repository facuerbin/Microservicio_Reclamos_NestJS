import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as logoutObserver from './rabbit/logoutService';

async function bootstrap() {
  // API
  const app = await NestFactory.create(AppModule);

  // RabbitMQ
  logoutObserver.init();

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('API Reclamos Nest')
    .setDescription('Descripción de la API de Reclamos')
    .setVersion('1.0')
    .addTag('reclamos, complaints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
