import { Body, Controller, Get, Logger, Param, Post, Put, Res } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { User } from './entities/User';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Complaint } from './complaint.schema';
import { Message } from './entities/Message';
import { UpdateComplaintDto } from './dto/update.complaint.dto';


@Controller("api/v1/reclamos")
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService
  ) { }

  @Get() // Listar reclamos del usuario
  @ApiTags("Listar reclamos")
  @ApiBearerAuth("jwt")
  @ApiOkResponse({ description: "La solicitud fue exitosa.", type: [Complaint] })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  async getComplaints(@Res() res) {
    if (res.locals.user && res.locals.user.permissions.indexOf("admin") > -1) {
      // Si es admin puede ver todos los reclamos
      this.complaintsService.findAllAdmin()
        .then(list => {
          return res.status(200).send(list);
        })
        .catch(error => {
          Logger.error(`Get() Error: ${error.toString()}`);
          return res.status(400).send();
        })
    } else {
      // Sino solo los que el usuario ha realizado
      this.complaintsService.findAll(res.locals.user.id)
        .then(list => {
          return res.status(200).send(list);
        })
        .catch(error => {
          Logger.error(`Get() Error: ${error.toString()}`);
          return res.status(400).send();
        })
    }
  }

  @Post() // Crear reclamo de usuario
  @ApiTags("Crear reclamo")
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
        Logger.error(`Post() Error: ${error.toString()}`);
        return res.status(400).send();
      });
  }


  @Get(":id") // Obtener detalle de reclamo
  @ApiTags("Detalle reclamo")
  @ApiBearerAuth("jwt")
  @ApiParam({ name: 'id', required: true, description: 'Id del reclamo que se desea consultar' })
  @ApiOkResponse({ description: "Se encontró el reclamo solicitado.", type: Complaint })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  getComplaintDetail(@Param() params, @Res() res) {
    this.complaintsService.findById(params.id, res.locals.user.id, res.locals.user.permissions)
      .then(result => {
        if (!result) {
          throw new Error("Invalid complaint id");
        }

        return res.status(200).send({ data: result });
      })
      .catch(error => {
        Logger.error(`Get(/:id) Error: ${error.toString()}`);
        return res.status(400).send();
      })

  }

  @Put(":id") // Actualizar el estado del reclamo
  @ApiTags("Actualizar estado del reclamo")
  @ApiBearerAuth("jwt")
  @ApiParam({ name: 'id', required: true, description: 'Id del reclamo que se desea actualizar' })
  @ApiOkResponse({ description: "El reclamo fue actualizado exitosamente.", type: Complaint })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  updateComplaint(@Param() params, @Res() res, @Body() body: UpdateComplaintDto) {
    this.complaintsService.updateStatus(params.id, res.locals.user, body.status)
      .then(result => {
        if (!result) {
          throw new Error("Invalid complaint");
        }

        return res.status(200).send({ data: result });
      })
      .catch(error => {
        Logger.error(`Put(/:id) Error: ${error.toString()}`);
        return res.status(400).send();
      })
  }

  @Put(":complaintId/msg") // Agregar un mensaje al reclamo
  @ApiTags("Nuevo mensaje del reclamo")
  @ApiBearerAuth("jwt")
  @ApiParam({ name: 'complaintId', required: true, description: 'Id del reclamo que se desea actualizar' })
  @ApiOkResponse({ description: "Se generó un nuevo mensaje en el reclamo.", type: Message })
  @ApiResponse({ status: 200, description: 'Se generó un nuevo mensaje en el reclamo.' })
  @ApiResponse({ status: 401, description: 'Operación no autorizada.' })
  @ApiResponse({ status: 400, description: 'Ocurrió un error al procesar su solicitud.' })
  putMessage(@Param() params, @Body() body: CreateMessageDto, @Res() res) {
    try {
      const user = res.locals.user as User;
      if (!body.message && !body.imageUrl) {
        Logger.error(`Put(/:complaintId/msg) Error: Empty message error`)
        throw new Error()
      }
      this.complaintsService.createMessage(user, params.complaintId, body)
        .then(result => {
          return res.status(200).send({ data: result });
        })
    } catch (error) {
      Logger.error(`Put(/:complaintId/msg) Error: ${error.toString()}`);
      return res.status(400).send();
    }
  }
}