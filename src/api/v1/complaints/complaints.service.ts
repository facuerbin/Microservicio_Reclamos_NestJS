import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { Message } from './entities/Message';
import { Cart } from './entities/Cart';
import { Article } from './entities/Article';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { GetOrderDto } from './dto/get.order.dto';


@Injectable()
export class ComplaintsService {
  constructor(
    private http: HttpService,
    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>
  ) { }

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const initialMessage = Builder<Message>()
      .content(createComplaintDto.message)
      .created(new Date())
      .dateRead(null)
      .userId("1")
      .messageId("1")
      .build();

    try {
      let order = this.http.get(
        `${process.env.ORDERS_API}/${createComplaintDto.orderId}`
        )
    } catch (error) {
      console.log(error.message);
    }

    const article = Builder<Article>()
      .id("1")
      .quantity(5)
      .valid(true)
      .validated(true)
      .build();

    const cart = Builder<Cart>()
      .id("1")
      .articles([article])
      .build();

    const newComplaint = Builder<Complaint>()
      .cart(cart)
      .created(new Date())
      .messages([initialMessage])
      .orderId("1")
      .status("Pendiente")
      .updated(null)
      .userId("1")
      .build();

    const createdComplaint = new this.complaintModel(newComplaint);
    return createdComplaint.save();
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintModel.find().exec();
  }

  getHello(): string {
    return 'Hello World from NestJS!!';
  }
}
