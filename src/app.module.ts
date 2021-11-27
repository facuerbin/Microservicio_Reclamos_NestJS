import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsModule } from './api/v1/complaints/complaints.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ComplaintsController } from './api/v1/complaints/complaints.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://localhost:${config.DB_PORT}/${config.DB_NAME}`
    ),
    ComplaintsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ComplaintsController);
  }
}
