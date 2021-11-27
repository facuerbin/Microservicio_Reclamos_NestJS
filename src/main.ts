import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as logoutObserver from './rabbit/logout.service';
import * as orderObserver from './rabbit/order.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // API
  const app = await NestFactory.create(AppModule);

  // RabbitMQ
  logoutObserver.init();
  orderObserver.init();

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('API Reclamos Nest')
    .setDescription('Microservicio que permite generar reclamos asociados a una orden. Estos reclamos pueden caer sobre toda la orden o sobre un productor en particular. Adicionalmente permite el envio de mensajes entre el cliente (quien crea el reclamo) y los administradores del ecomerce para llegar a un acuerdo. Estos mensajes pueden contener tanto texto cómo también pueden incluir la URL de una imagen almacenda en el servicio de Imagenes. Finalmente el cliente cómo administradores podrán cerrar los reclamos activos con resultado Resuelto o Cancelado. \n<a href="https://github.com/facuerbin/Microservicio_Reclamos_NestJS">Github</a>')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        description: "Por favor ingrese el token de la siguiente forma: bearer {jwt}",
        type: "apiKey",
        name: "Authorization",
        bearerFormat: "bearer",
        scheme: "bearer",
        in: "header"
      },
      "jwt"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(process.env.SERVER_PORT);
  Logger.log(`App listening on port ${process.env.SERVER_PORT}`);
}
bootstrap();
