import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createClient } from '@supabase/supabase-js';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma.service';

@Controller('applications')
export class ApplicationsController {
  // Tambahkan tanda seru (!) pada env var
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('resume'))
  async apply(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) throw new Error('File PDF Wajib!');

    // 1. Upload ke Supabase
    const fileName = `resumes/${Date.now()}_${file.originalname}`;
    await this.supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    const { data } = this.supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // 2. AI Processing
    const text = await this.aiService.extractTextFromPdf(file.buffer);
    const job = await this.prisma.job.findUnique({ where: { id: body.jobId } });
    if (!job) throw new Error('Job tidak ditemukan!');
    const analysis = await this.aiService.analyzeCandidate(
      text,
      job.requirements,
    );

    // 3. Save DB
    return this.prisma.application.create({
      data: {
        jobId: body.jobId,
        candidateName: body.name,
        email: body.email,
        resumeUrl: data.publicUrl,
        resumeText: text,
        skillsExtracted: analysis.skills,
        summary: analysis.summary,
        matchScore: analysis.matchScore,
        matchExplanation: analysis.explanation,
        status: analysis.matchScore >= 80 ? 'interview_suggested' : 'applied',
      },
    });
  }

  @Get('job/:jobId')
  async getByJob(@Param('jobId') id: string) {
    return this.prisma.application.findMany({
      where: { jobId: id },
      orderBy: { matchScore: 'desc' },
    });
  }
}
