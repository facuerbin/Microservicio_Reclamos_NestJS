import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  issue: string;

  @ApiProperty({ required: false })
  articleId: string | null;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  imageUrl: string | null;

}