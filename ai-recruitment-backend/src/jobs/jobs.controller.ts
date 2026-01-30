import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JobsService } from './jobs.service'; // Panggil Service, bukan Prisma langsung
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getAllJobs() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createJob(
    @Request() req,
    @Body() body: { title: string; description: string; requirements: string },
  ) {
    // Ambil ID User dari Token JWT (biasanya tersimpan di 'sub' atau 'userId')
    const userId = req.user.userId || req.user.sub || req.user.id;

    return this.jobsService.create(body, userId);
  }
}
