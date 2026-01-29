import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Mocking Dependencies (Pura-pura)
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(() => 'token_palsu_buat_test'),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Harus berhasil REGISTER user baru', async () => {
    const dto = { email: 'baru@test.com', password: '123', name: 'User Baru' };

    // 1. Mock Prisma: Anggap email belum ada (null)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // 2. Mock Prisma: Pura-pura sukses create
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id-1',
      email: dto.email,
      password: 'hashedpassword', // Anggap sudah di-hash
    });

    const result = await service.register(dto);

    // Assert (Pengecekan)
    expect(result).toHaveProperty('accessToken'); // Harus dapet token
    expect(prisma.user.create).toHaveBeenCalled(); // Fungsi create harus terpanggil
    expect(result.accessToken).toBe('token_palsu_buat_test');
  });

  it('Harus GAGAL register jika email duplikat', async () => {
    const dto = { email: 'lama@test.com', password: '123' };

    // 1. Mock Prisma: Anggap email SUDAH ada
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing',
      email: dto.email,
    });

    // Assert: Harus error BadRequest
    await expect(service.register(dto)).rejects.toThrow();
  });
});
