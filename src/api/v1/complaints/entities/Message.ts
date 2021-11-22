import { ApiProperty } from "@nestjs/swagger";

export class Message {
    @ApiProperty()
    messageId: string;
    @ApiProperty()
    created: Date;
    @ApiProperty({ required: false })
    dateRead: Date;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    content: string;
    @ApiProperty({ required: false })
    imageUrl: string;
}