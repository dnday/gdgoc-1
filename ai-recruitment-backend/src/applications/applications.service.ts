import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { createClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ApplicationsService {
  // Supabase Client
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  // Nodemailer Transporter (Gmail)
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  // --- FITUR 1: APPLY JOB (UPLOAD + ANALISIS) ---
  async apply(
    jobId: string,
    candidateName: string,
    email: string,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File PDF Wajib!');

    // A. Upload ke Supabase
    const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
    const { error } = await this.supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException(`Upload Error: ${error.message}`);

    const { data: publicUrlData } = this.supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // B. AI Processing
    const text = await this.aiService.extractTextFromPdf(file.buffer);
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });

    if (!job) throw new NotFoundException('Job tidak ditemukan!');

    const analysis = await this.aiService.analyzeCandidate(
      text,
      job.requirements,
    );

    // C. Save to DB
    return this.prisma.application.create({
      data: {
        jobId,
        candidateName,
        email,
        resumeUrl: publicUrlData.publicUrl,
        resumeText: text,
        skillsExtracted: analysis.skills,
        summary: analysis.summary,
        matchScore: analysis.matchScore,
        matchExplanation: analysis.explanation,
        status: analysis.matchScore >= 80 ? 'interview_suggested' : 'applied',
      },
    });
  }

  // --- FITUR 2: GET LIST PELAMAR ---
  async findByJob(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
      orderBy: { matchScore: 'desc' },
    });
  }

  // --- FITUR 2.5: CEK APAKAH SUDAH APPLY ---
  async hasApplied(jobId: string, email: string) {
    const existing = await this.prisma.application.findFirst({
      where: { jobId, email },
    });
    return { hasApplied: !!existing };
  }

  // --- FITUR 2.6: GET ALL APPLIED JOB IDs ---
  async getAppliedJobIds(email: string) {
    const applications = await this.prisma.application.findMany({
      where: { email },
      select: { jobId: true },
    });
    return applications.map((app) => app.jobId);
  }

  // --- FITUR 3: GENERATE DRAFT EMAIL ---
  async generateEmailDraft(
    appId: string,
    action: 'accepted' | 'rejected',
    interviewDate?: string,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { job: true },
    });
    if (!app) throw new NotFoundException('Pelamar tidak ditemukan');

    // Jika Accepted -> Pakai Tanggal Interview. Jika Rejected -> Pakai Alasan AI.
    const extraInfo =
      action === 'accepted' ? interviewDate : app.matchExplanation || undefined;

    const draftBody = await this.aiService.generateEmailDraft(
      app.candidateName,
      app.job.title,
      action,
      extraInfo,
    );

    const subject =
      action === 'accepted'
        ? `Undangan Interview - ${app.job.title}`
        : `Update Lamaran Kerja - ${app.job.title}`;

    return { draft: draftBody, emailTo: app.email, subject };
  }

  // --- FITUR 4: KIRIM EMAIL BENERAN + UPDATE STATUS ---
  async sendRealEmail(
    appId: string,
    to: string,
    subject: string,
    message: string,
    status: 'accepted' | 'rejected', // Tambahkan status baru
  ) {
    try {
      // 1. Kirim Email
      await this.transporter.sendMail({
        from: `"HR Team - Maya" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
      });

      // 2. Update Status di DB
      await this.prisma.application.update({
        where: { id: appId },
        data: { status },
      });

      return { success: true, message: 'Email terkirim & Status diupdate!' };
    } catch (error) {
      console.error('Email Error:', error);
      throw new BadRequestException(
        `Gagal mengirim email: ${error.message || error}`,
      );
    }
  }
}
