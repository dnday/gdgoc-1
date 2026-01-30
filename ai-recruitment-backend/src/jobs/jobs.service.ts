import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  // Ambil semua job + hitung jumlah pelamar + recruiter info
  async findAll() {
    return this.prisma.job.findMany({
      // where: { isActive: true }, // Hapus atau comment ini agar semua job (termasuk closed) muncul
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
      include: {
        recruiter: {
          select: { name: true, email: true },
        },
        _count: {
          select: { applications: true }, // PENTING: Hitung jumlah aplikasi
        },
      },
    });
  }

  // Ambil satu job berdasarkan ID + semua aplikasi
  async findById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: { name: true, email: true },
        },
        applications: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  // Buat job baru & hubungkan ke User ID
  async create(data: any, recruiterId: string) {
    return this.prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        recruiter: { connect: { id: recruiterId } },
      },
    });
  }

  // Update Job
  async update(id: string, data: any) {
    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  // Delete Job
  async delete(id: string) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
