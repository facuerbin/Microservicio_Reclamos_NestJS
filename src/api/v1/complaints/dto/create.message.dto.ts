import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;
}