import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../entities/Message';

export class CreateComplaintDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  message: string;
}