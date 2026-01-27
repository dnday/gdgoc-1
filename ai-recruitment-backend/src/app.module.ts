import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, JobsModule, ApplicationsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
