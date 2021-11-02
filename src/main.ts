import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // API
  const app = await NestFactory.create(AppModule);
  
  /*
  // RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'complaints',
      queueOptions: {
        durable: true
      },
    },
  });
  */

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
