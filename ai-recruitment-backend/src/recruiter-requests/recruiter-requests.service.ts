import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma.service';
import { CreateRecruiterRequestDto } from './dto/create-recruiter-request.dto';
import { ReviewRecruiterRequestDto } from './dto/review-recruiter-request.dto';

@Injectable()
export class RecruiterRequestsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Submit recruiter request
  async create(userId: string, dto: CreateRecruiterRequestDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already a recruiter
    if (user.role === 'recruiter') {
      throw new BadRequestException('You are already a recruiter');
    }

    // Check if already has pending request
    const existingRequest = await this.prisma.recruiterRequest.findUnique({
      where: { userId },
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        throw new BadRequestException(
          'You already have a pending request. Please wait for review.',
        );
      }
      if (existingRequest.status === 'approved') {
        throw new BadRequestException('Your request has already been approved');
      }
      // If rejected, allow resubmission by deleting old request
      await this.prisma.recruiterRequest.delete({
        where: { id: existingRequest.id },
      });
    }

    // Create new request
    const request = await this.prisma.recruiterRequest.create({
      data: {
        userId,
        companyName: dto.companyName,
        companyEmail: dto.companyEmail,
        companyWebsite: dto.companyWebsite,
        position: dto.position,
        reason: dto.reason,
      },
    });

    // Send confirmation email
    try {
      await this.emailService.sendRecruiterRequestSubmitted(
        user.email,
        user.name || 'User',
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return {
      message: 'Recruiter request submitted successfully',
      request,
    };
  }

  // Get all requests (admin only)
  async findAll(status?: string) {
    const where = status ? { status } : {};

    return this.prisma.recruiterRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
            role: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  // Get single request
  async findOne(id: string) {
    const request = await this.prisma.recruiterRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  // Get my request (for logged in user)
  async getMyRequest(userId: string) {
    const request = await this.prisma.recruiterRequest.findUnique({
      where: { userId },
    });

    return request;
  }

  // Review request (approve/reject)
  async review(id: string, dto: ReviewRecruiterRequestDto, adminId: string) {
    const request = await this.prisma.recruiterRequest.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException(
        `Request has already been ${request.status}`,
      );
    }

    const updateData: any = {
      status: dto.action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: adminId,
      reviewNotes: dto.reviewNotes,
    };

    // Update request status
    const updatedRequest = await this.prisma.recruiterRequest.update({
      where: { id },
      data: updateData,
    });

    // If approved, update user role
    if (dto.action === 'approve') {
      await this.prisma.user.update({
        where: { id: request.userId },
        data: {
          role: 'recruiter',
        },
      });

      // Send approval email
      try {
        await this.emailService.sendRecruiterRequestApproved(
          request.user.email,
          request.user.name || 'User',
        );
      } catch (error) {
        console.error('Failed to send approval email:', error);
      }
    } else {
      // Send rejection email
      try {
        await this.emailService.sendRecruiterRequestRejected(
          request.user.email,
          request.user.name || 'User',
          dto.reviewNotes,
        );
      } catch (error) {
        console.error('Failed to send rejection email:', error);
      }
    }

    return {
      message: `Request ${dto.action === 'approve' ? 'approved' : 'rejected'} successfully`,
      request: updatedRequest,
    };
  }

  // Delete request
  async remove(id: string) {
    const request = await this.prisma.recruiterRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.prisma.recruiterRequest.delete({
      where: { id },
    });

    return {
      message: 'Request deleted successfully',
    };
  }
}
