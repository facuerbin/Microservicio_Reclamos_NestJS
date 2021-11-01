import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  message: string;
}