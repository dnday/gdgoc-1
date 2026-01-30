import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  // 1. Upload & Apply
  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  async apply(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.appService.apply(
      body.jobId,
      body.candidateName,
      body.email,
      file,
    );
  }

  // 2. Get List by Job ID
  @Get('job/:jobId')
  async getByJob(@Param('jobId') id: string) {
    return this.appService.findByJob(id);
  }

  // 2.5 Check if already applied
  @Get('check/:jobId/:email')
  async hasApplied(
    @Param('jobId') jobId: string,
    @Param('email') email: string,
  ) {
    return this.appService.hasApplied(jobId, email);
  }

  // 2.6 Get All Applied Job IDs
  @Get('candidate/applied')
  async getAppliedJobs(@Query('email') email: string) {
    return this.appService.getAppliedJobIds(email);
  }

  // 3. Generate Draft Email (Preview)
  @Post('generate-draft')
  async generateDraft(
    @Body()
    body: {
      appId: string;
      action: 'accepted' | 'rejected';
      interviewDate?: string;
    },
  ) {
    return this.appService.generateEmailDraft(
      body.appId,
      body.action,
      body.interviewDate,
    );
  }

  // 4. Send Real Email (Action)
  @Post('send-email')
  async sendEmail(
    @Body()
    body: {
      appId: string;
      to: string;
      subject: string;
      message: string;
      status: 'accepted' | 'rejected';
    },
  ) {
    return this.appService.sendRealEmail(
      body.appId,
      body.to,
      body.subject,
      body.message,
      body.status,
    );
  }
}
