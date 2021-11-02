import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { User } from './entities/User';
import { ClientProxy } from '@nestjs/microservices';
import { Status } from './entities/Status';

@Controller("api/v1/reclamos")
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService,
    @Inject('RMQ_SERVICE') private rmqClient: ClientProxy
  ) { }

  @Get() //User Route
  async getUserComplaints(@Res() res) {
    const list = await this.complaintsService.findAll(res.locals.user.id);
    return res.status(200).send(list);
  }

  @Post() // User Route
  postComplaint(@Body() createComplaintDto: CreateComplaintDto, @Res() res) {
    this.complaintsService.create(createComplaintDto, res.locals.user)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(400).send();
      });
  }

  @Get("admin") //Admin Route
  async getComplaintsAdmin(@Res() res) {
    this.complaintsService.findAllAdmin()
      .then(list => {
        return res.status(200).send(list);
      })
      .catch(error => {
        return res.status(400).send();
      })
  }

  @Get(":id")
  getComplaintDetail(@Param() params, @Res() res) {
    this.complaintsService.findById(params.id, res.locals.user.id)
      .then(result => {
        if (!result) {
          throw new Error("Invalid complaint id");
        }

        return res.status(200).send({ data: result });
      })
      .catch(error => {
        return res.status(400).send();
      })

  }

  @Put(":id")
  updateComplaint(@Param() params, @Res() res, @Body() body) {
    this.complaintsService.updateStatus(params.id, res.locals.user, body.status)
      .then(result => {
        if ( !result ) {
          throw new Error("Invalid complaint");
        }

        return res.status(200).send({ data: result });
      })
      .catch(error => {
        return res.status(400).send();
      })
  }

  @Put(":complaintId/msg")
  putMessage(@Param() params, @Body() body: CreateMessageDto, @Res() res) {
    try {
      const user = res.locals.user as User;
      if (!body.message && !body.imageUrl) {
        throw new Error()
      }
      this.complaintsService.createMessage(user, params.complaintId, body)
        .then(result => {
          return res.status(200).send({ data: result });
        })
    } catch (error) {
      return res.status(400).send();
    }
  }

}