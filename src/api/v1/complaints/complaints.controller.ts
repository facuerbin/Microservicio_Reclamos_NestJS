import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create.complaint.dto';
import { CreateMessageDto } from './dto/create.message.dto';

@Controller("api/v1/reclamos")
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService
  ) { }

  @Get("hello")
  getHello(): string {
    return this.complaintsService.getHello();
  }

  @Get()
  userListComplaints(): string {
    return this.complaintsService.getHello();
  }

  @Post()
  async createComplaint(@Body() createComplaintDto: CreateComplaintDto) {
    this.complaintsService.create(createComplaintDto);
    return HttpCode
  }
}