import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- 1. UTILITY: Generate Token ---
  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      },
    };
  }

  // --- 2. FITUR REGISTER MANUAL ---
  async register(body: any) {
    // Cek apakah email sudah ada
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email ini sudah terdaftar!');
    }

    // Hash Password (Encrypt)
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Simpan User Baru dengan role
    const newUser = await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: body.role || 'recruiter', // Default ke recruiter jika tidak ada
      },
    });

    // Langsung login-kan user
    return this.generateToken(newUser);
  }

  // --- 3. FITUR LOGIN MANUAL ---
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Cek user ada DAN password cocok
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Buang password dari object return
      return result;
    }
    return null;
  }

  async login(user: any) {
    return this.generateToken(user);
  }

  // --- 4. FITUR LOGIN GOOGLE ---
  async validateGoogleUser(details: any) {
    const user = await this.prisma.user.findFirst({
      where: { email: details.email },
    });
    
    // Jika user sudah ada, return user (existing user - login)
    if (user) return { user, isNewUser: false };

    // Jika user baru dan role sudah ada (dari state parameter), create user
    if (details.role) {
      const newUser = await this.prisma.user.create({
        data: {
          email: details.email,
          name: details.name,
          picture: details.picture,
          role: details.role,
        },
      });
      return { user: newUser, isNewUser: false };
    }

    // Jika user baru tapi belum ada role, return data untuk role selection
    return { 
      user: null, 
      isNewUser: true,
      tempUserData: {
        email: details.email,
        name: details.name,
        picture: details.picture,
      }
    };
  }

  // --- 5. CREATE GOOGLE USER AFTER ROLE SELECTION ---
  async createGoogleUser(data: any) {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        picture: data.picture,
        role: data.role,
      },
    });
  }
}
