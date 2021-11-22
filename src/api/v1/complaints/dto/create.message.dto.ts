import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  imageUrl: string;
}