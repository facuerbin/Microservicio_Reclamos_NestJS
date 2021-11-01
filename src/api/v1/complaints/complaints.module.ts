import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { ComplaintSchema, Complaint } from './complaint.schema';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Complaint.name, schema: ComplaintSchema
    }]),
    HttpModule
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({
        path: "api/v1/reclamos",
        method: RequestMethod.ALL
      });
  }
}
