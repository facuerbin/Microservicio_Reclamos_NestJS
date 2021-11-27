import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsModule } from './api/v1/complaints/complaints.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ComplaintsController } from './api/v1/complaints/complaints.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
    ),
    ComplaintsModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ComplaintsController);
  }
}
