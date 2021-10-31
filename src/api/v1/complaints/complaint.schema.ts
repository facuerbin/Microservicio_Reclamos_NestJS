import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Article } from './entities/Article';
import { Message } from './entities/Message';
import { Cart } from './entities/Cart';


export type ComplaintDocument = Complaint & Document;

@Schema()
export class Complaint {
    @Prop()
    userId: string;
    
    @Prop()
    created: Date;
    
    @Prop()
    updated: Date;
    
    @Prop()
    status: string;
    
    @Prop()
    orderId: string;

    @Prop({type: Cart})
    cart: {
        id: string,
        articles: [Article]
    };

    @Prop()
    messages: [Message];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);