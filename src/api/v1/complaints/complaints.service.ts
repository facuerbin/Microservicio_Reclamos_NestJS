import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { Message } from './entities/Message';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { GetOrderDto } from './dto/get.order.dto';
import { GetUserDto } from './dto/get.user.dto';
import { User } from './entities/User';


@Injectable()
export class ComplaintsService {
  constructor(
    private http: HttpService,
    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>
  ) { }

  async create(createComplaintDto: CreateComplaintDto, user: User): Promise<Complaint>{
    let order = await this.getOrder(createComplaintDto.orderId, user.jwt);

    const initialMessage = Builder<Message>()
    .content(createComplaintDto.message)
    .created(new Date())
    .dateRead(null)
    .userId(user.id)
    .messageId("1")
    .build();
        
    const newComplaint = Builder<Complaint>()
    .cart({
      id: order.cartId,
      articles: order.articles,
    })
    .created(new Date())
    .messages([initialMessage])
    .orderId(order.id)
    .status("Pendiente")
    .updated(null)
    .userId(user.id)
    .build();
    return new this.complaintModel(newComplaint).save();
  }

  async findAll(userId: string): Promise<Complaint[]> {
    return this.complaintModel.find({
      userId
    }).exec();
  }

  async findById(id: string, userId: string): Promise<Complaint> {
    return this.complaintModel.findOne({
      _id: id,
      userId
    }).exec();
  }

  async createMessage(user: User, complaintId: string, messageContent: string): Promise<Complaint> {
    const complaint = await this.complaintModel.findById(complaintId).exec();

    const message = Builder<Message>()
    .content(messageContent)
    .created(new Date())
    .dateRead(null)
    .userId(user.id)
    .messageId("1")
    .build();
    
    complaint.messages.push(message);
    complaint.updated = new Date();
    return complaint.save();
  }

  async getOrder(id: string, jwt: string): Promise<GetOrderDto> {
    return await this.http.get<GetOrderDto>(
      `${process.env.ORDERS_API}/${id}`
      , {
        headers: {
          'Authorization': jwt
        }
      }).toPromise().then(res => res.data) as GetOrderDto;
  }
}
