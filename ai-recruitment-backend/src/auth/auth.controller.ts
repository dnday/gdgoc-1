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

    // Login user (baik existing maupun new user)
    const data = await this.authService.login(result.user);
    const user = result.user;

    // Build redirect URL with user info
    const params = new URLSearchParams({
      token: data.accessToken,
      role: user.role || 'candidate',
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
    });

    if (user.picture) {
      params.append('picture', user.picture);
    }

    res.redirect(`http://localhost:3001/login-success?${params.toString()}`);
  }
}
