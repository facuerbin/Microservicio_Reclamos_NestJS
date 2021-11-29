import { ApiProperty } from '@nestjs/swagger';

export class UpdateComplaintDto {
  @ApiProperty({ enum: ['Solved', 'Canceled'],required: true })
  status: string;
}