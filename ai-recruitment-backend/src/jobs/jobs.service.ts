import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  // Ambil semua job + hitung jumlah pelamar
  async findAll() {
    return this.prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
      include: {
        _count: {
          select: { applications: true }, // PENTING: Hitung jumlah aplikasi
        },
      },
    });
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
}
