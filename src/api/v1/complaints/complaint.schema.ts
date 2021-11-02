import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './entities/Message';


export type ComplaintDocument = Complaint & Document;

@Schema()
export class Complaint {
    @Prop({ required: true })
    userId: string;
    
    @Prop()
    created: Date;
    
    @Prop()
    updated: Date;
    
    @Prop({ required: true })
    status: string;
    
    @Prop({ required: true })
    orderId: string;

    @Prop()
    articleId: string;

    @Prop({ required: true })
    issue: string;

    @Prop({ required: true })
    messages: [Message];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);