import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { User } from './entities/User';

@Controller("api/v1/reclamos")
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService
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

  @Put(":complaintId/msg")
  putMessage(@Param() params, @Body() body: CreateMessageDto, @Res() res) {
    try {
      const user = res.locals.user as User;
      if ( !body.message ) {
        throw new Error()
      }
      this.complaintsService.createMessage(user, params.complaintId, body.message)
        .then(result => {
          return res.status(200).send({ data: result });
        })
    } catch (error) {
      return res.status(400).send();
    }
  }

}