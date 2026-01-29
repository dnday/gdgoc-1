import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      passReqToCallback: true, // Enable to access request in validate
    });
  }
  
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, displayName, photos } = profile;
    
    // Extract role from state parameter
    let role = 'recruiter'; // default
    try {
      if (request.query.state) {
        const state = JSON.parse(decodeURIComponent(request.query.state));
        role = state.role || 'recruiter';
      }
    } catch (e) {
      // If state parsing fails, use default
    }
    
    // Extract user details from Google profile
    const userDetails = {
      email: emails[0].value,
      name: displayName,
      picture: photos && photos.length > 0 ? photos[0].value : null,
      role,
    };
    
    // Validate/create user in database
    const user = await this.authService.validateGoogleUser(userDetails);
    done(null, user);
  }
}
