import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma.service';

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

  // --- FITUR 2.7: GET APPLICATIONS BY USER ID ---
  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            company: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- FITUR 2.8: GET APPLICATION STATUS ---
  async getApplicationStatus(jobId: string, email: string) {
    const application = await this.prisma.application.findFirst({
      where: { jobId, email },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    if (!application) {
      return { applied: false, status: null };
    }

    return {
      applied: true,
      status: application.status,
      applicationId: application.id,
      appliedAt: application.createdAt,
    };
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
      // Get application details for better email
      const app = await this.prisma.application.findUnique({
        where: { id: appId },
        include: { job: true },
      });

      // Create professional HTML email
      const isAccepted = status === 'accepted';
      const gradientColor = isAccepted
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      const iconEmoji = isAccepted ? '🎉' : '📧';

      const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: ${gradientColor}; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${iconEmoji} RecruitPro</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">AI-Powered Recruitment Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #ffffff;">
                      <div style="white-space: pre-wrap; color: #333333; font-size: 16px; line-height: 1.8;">${message}</div>
                      
                      ${
                        isAccepted
                          ? `
                      <table style="margin: 30px 0; width: 100%; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 10px 0; color: #065f46; font-size: 15px; font-weight: bold;">📋 Next Steps:</p>
                            <p style="margin: 0 0 8px 0; color: #047857; font-size: 14px; line-height: 1.6;">
                              • Please confirm your availability at your earliest convenience
                            </p>
                            <p style="margin: 0 0 8px 0; color: #047857; font-size: 14px; line-height: 1.6;">
                              • Prepare questions about the role and our company
                            </p>
                            <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                              • Review the job description and requirements
                            </p>
                          </td>
                        </tr>
                      </table>
                      `
                          : ''
                      }
                      
                      <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you have any questions, please reply to this email or contact us at 
                        <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea;">${process.env.EMAIL_USER}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © 2026 RecruitPro - AI Recruitment Platform. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                        Position: ${app?.job?.title || 'N/A'} | This email was sent to ${to}
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // 1. Kirim Email
      await this.transporter.sendMail({
        from: `"HR Team - Maya" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message, // Plain text fallback
        html: htmlEmail, // HTML version
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
