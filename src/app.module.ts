import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsModule } from './api/v1/complaints/complaints.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
    ),
    ComplaintsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
