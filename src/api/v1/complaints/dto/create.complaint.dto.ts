import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  issue: string;

  @ApiProperty()
  message: string;
}