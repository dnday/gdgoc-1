import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { JobsModule } from './jobs/jobs.module';
import { RecruiterRequestsModule } from './recruiter-requests/recruiter-requests.module';

@Module({
  imports: [
    AuthModule,
    JobsModule,
    ApplicationsModule,
    AiModule,
    EmailModule,
    RecruiterRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
