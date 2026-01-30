import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecruiterRequestDto } from './dto/create-recruiter-request.dto';
import { ReviewRecruiterRequestDto } from './dto/review-recruiter-request.dto';
import { RecruiterRequestsService } from './recruiter-requests.service';

@Controller('recruiter-requests')
export class RecruiterRequestsController {
  constructor(
    private readonly recruiterRequestsService: RecruiterRequestsService,
  ) {}

  // Submit recruiter request (authenticated users only)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req, @Body() createDto: CreateRecruiterRequestDto) {
    return this.recruiterRequestsService.create(req.user.userId, createDto);
  }

  // Get all requests (admin only - TODO: add admin guard)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('status') status?: string) {
    return this.recruiterRequestsService.findAll(status);
  }

  // Get my request
  @Get('my-request')
  @UseGuards(AuthGuard('jwt'))
  getMyRequest(@Request() req) {
    return this.recruiterRequestsService.getMyRequest(req.user.userId);
  }

  // Get single request
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.recruiterRequestsService.findOne(id);
  }

  // Review request (admin only - TODO: add admin guard)
  @Patch(':id/review')
  @UseGuards(AuthGuard('jwt'))
  review(
    @Param('id') id: string,
    @Body() reviewDto: ReviewRecruiterRequestDto,
    @Request() req,
  ) {
    return this.recruiterRequestsService.review(id, reviewDto, req.user.userId);
  }

  // Delete request
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.recruiterRequestsService.remove(id);
  }
}
