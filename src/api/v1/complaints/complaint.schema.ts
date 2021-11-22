import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Message } from './entities/Message';


export type ComplaintDocument = Complaint & Document;

@Schema()
export class Complaint {
    @ApiProperty()
    @Prop({ required: true })
    userId: string;
    
    @ApiProperty()
    @Prop()
    created: Date;
    
    @ApiProperty({ required: false })
    @Prop()
    updated: Date;
    
    @ApiProperty()
    @Prop({ required: true })
    status: string;
    
    @ApiProperty()
    @Prop({ required: true })
    orderId: string;

    @ApiProperty({ required: false })
    @Prop()
    articleId: string;

    @ApiProperty()
    @Prop({ required: true })
    issue: string;

    @ApiProperty()
    @Prop({ required: true })
    messages: [Message];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);