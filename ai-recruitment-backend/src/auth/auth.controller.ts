import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- ENDPOINT REGISTER ---
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // --- ENDPOINT LOGIN MANUAL ---
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email atau Password salah!');
    }
    return this.authService.login(user);
  }

  // --- ENDPOINT GOOGLE ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = req.user;

    // Jika user baru dan belum ada role, redirect ke halaman pilih role
    if (result.isNewUser && !result.user) {
      const tempData = encodeURIComponent(JSON.stringify(result.tempUserData));
      return res.redirect(`http://localhost:3001/select-role?data=${tempData}`);
    }

    // Jika user sudah ada atau baru dengan role, login
    const data = await this.authService.login(result.user);
    const user = result.user;

    // Build redirect URL with user info
    const params = new URLSearchParams({
      token: data.accessToken,
      role: user.role || 'recruiter',
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
    });

    if (user.picture) {
      params.append('picture', user.picture);
    }

    res.redirect(`http://localhost:3001/login-success?${params.toString()}`);
  }

  // --- ENDPOINT COMPLETE GOOGLE REGISTRATION ---
  @Post('google/complete')
  async completeGoogleRegistration(@Body() body: any) {
    // Create user with role after role selection
    const newUser = await this.authService.createGoogleUser(body);
    return this.authService.login(newUser);
  }
}
