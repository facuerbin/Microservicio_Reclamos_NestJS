import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { Model, Types } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { Message } from './entities/Message';
import { HttpService } from '@nestjs/axios';
import { GetOrderDto } from './dto/get.order.dto';
import { User } from './entities/User';
import { Status } from './entities/Status';
import { CreateMessageDto } from './dto/create.message.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from '../../../config/config';


@Injectable()
export class ComplaintsService {
  constructor(
    private http: HttpService,
    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>,
  ) { }

  async create(createComplaintDto: CreateComplaintDto, user: User): Promise<Complaint> {
    // Traigo la orden del servicio Orders
    let order = await this.getOrder(createComplaintDto.orderId, user.jwt);

    // Armo el mensaje
    const initialMessage = Builder<Message>()
      .content(createComplaintDto.message)
      .created(new Date())
      .dateRead(null)
      .userId(user.id)
      .messageId((new Types.ObjectId()).toString())
      .build();

    // Creo el reclamo
    const newComplaint = Builder<Complaint>()
      .articleId(createComplaintDto.articleId)
      .created(new Date())
      .issue(createComplaintDto.issue)
      .messages([initialMessage])
      .orderId(order.id)
      .status(Status.Active)
      .updated(null)
      .userId(user.id)
      .build();

    // Guardo el reclamo
    return new this.complaintModel(newComplaint).save();
  }

  async findAll(userId: string): Promise<Complaint[]> {
    return this.complaintModel.find({
      userId
    }).exec();
  }

  async findAllAdmin(): Promise<Complaint[]> {
    return this.complaintModel.find({
      status: Status.Active // traigo solo los reclamos no resueltos
    }).exec();
  }

  async findById(id: string, userId: string): Promise<Complaint> {
    // Traigo el reclamo
    const complaint = await this.complaintModel.findOne({
      _id: id,
      userId
    }).exec();

    // Cambio los mensajes a leídos
    complaint.messages.map(message => {
      if (message.userId === userId && !message.dateRead) {
        message.dateRead = new Date();
      }
    });

    // Guardo el reclamo
    return complaint.save();
  }

  async createMessage(user: User, complaintId: string, message: CreateMessageDto): Promise<Complaint> {
    // Traigo el reclamo
    const complaint = await this.complaintModel.findById(complaintId).exec();

    // Armo el mensaje
    const newMessage = Builder<Message>()
      .content(message.message)
      .created(new Date())
      .dateRead(null)
      .userId(user.id)
      .messageId((new Types.ObjectId()).toString())
      .imageUrl(message.imageUrl)
      .build();

    // Actualizo el reclamo
    complaint.updated = new Date();
    complaint.messages.push(newMessage);

    // Guardo el reclamo
    return complaint.save();
  }

  async updateStatus(id: string, user: User, status: string): Promise<Complaint> {
    // Traigo el reclamo
    const complaint = await this.complaintModel.findOne({
      _id: id,
      userId: user.id,
      status: Status.Active
    }).exec();

    // Actualizo el reclamo
    complaint.updated = new Date();
    complaint.status = Status[status];
    complaint.messages.push({
      userId: user.id,
      messageId: (new Types.ObjectId()).toString(),
      created: new Date(),
      dateRead: null,
      content: `Este reclamo fue cerrado por ${user.name}...`,
      imageUrl: null
    });

    // Guardo el reclamo
    return complaint.save();
  }

  // Método para traer la orden del microservicio Orders
  async getOrder(id: string, jwt: string): Promise<GetOrderDto> {
    return this.http.get<GetOrderDto>(
      `${config.ORDERS_API}/${id}`
      , {
        headers: {
          'Authorization': jwt
        }
      }).toPromise().then(res => res.data);
  }

  // Método que cancela los reclamos expirados
  @Cron(CronExpression.EVERY_10_SECONDS)
  async expirationhandler() {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() - 5);

    const results = await this.complaintModel.find({
      updated: {
        $lte: expiration,
      }, 
      status: Status.Active,
    }).exec();

    results.forEach(complaint => {
      complaint.status = Status.Expired;
      Logger.log(`Complaint: ${complaint.id} expired`);
      complaint.save()
    });
  }
}
