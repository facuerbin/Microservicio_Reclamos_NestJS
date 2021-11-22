import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { User } from './entities/User';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Complaint } from './complaint.schema';
import { Message } from './entities/Message';

@ApiTags("Reclamos")
@Controller("api/v1/reclamos")
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService,
    @Inject('RMQ_SERVICE') private rmqClient: ClientProxy
  ) { }

  @Get() // Listar reclamos del usuario
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "La solicitud fue exitosa.", type: [Complaint] })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  async getUserComplaints(@Res() res) {
    const list = await this.complaintsService.findAll(res.locals.user.id);
    return res.status(200).send(list);
  }

  @Post() // Crear reclamo de usuario
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "El reclamo se generó exitosamente.", type: Complaint })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  postComplaint(@Body() createComplaintDto: CreateComplaintDto, @Res() res) {
    this.complaintsService.create(createComplaintDto, res.locals.user)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(400).send();
      });
  }

  @Get("admin") // Listar todos los reclamos
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "La solicitud fue exitosa.", type: [Complaint] })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  async getComplaintsAdmin(@Res() res) {
    this.complaintsService.findAllAdmin()
      .then(list => {
        return res.status(200).send(list);
      })
      .catch(error => {
        return res.status(400).send();
      })
  }

  @Get(":id") // Obtener detalle de reclamo
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "Se encontró el reclamo solicitado.", type: Complaint })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
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

  @Put(":id") // Actualizar el estado del reclamo
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: "El reclamo fue actualizado exitosamente.", type: Complaint })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  updateComplaint(@Param() params, @Res() res, @Body() body) {
    this.complaintsService.updateStatus(params.id, res.locals.user, body.status)
      .then(result => {
        if (!result) {
          throw new Error("Invalid complaint");
        }

        return res.status(200).send({ data: result });
      })
      .catch(error => {
        return res.status(400).send();
      })
  }

  @Put(":complaintId/msg") // Agregar un mensaje al reclamo
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "Se generó un nuevo mensaje en el reclamo.", type: Message })
  @ApiResponse({ status: 200, description: 'Se generó un nuevo mensaje en el reclamo.' })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
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