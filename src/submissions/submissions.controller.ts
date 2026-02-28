import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateCalculatorSubmissionDto } from './dto/create-calculator-submission.dto';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // Public endpoints
  @Post('submissions/calculator')
  submitCalculator(@Body() dto: CreateCalculatorSubmissionDto) {
    return this.submissionsService.submitCalculator(dto);
  }

  @Post('submissions/contact')
  submitContact(@Body() dto: CreateContactSubmissionDto) {
    return this.submissionsService.submitContact(dto);
  }

  // Public: get submission by ID (for thank-you page)
  @Get('submissions/:id')
  findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.findOne(id);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/submissions')
  findAll() {
    return this.submissionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/submissions/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/submissions/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.remove(id);
  }
}
