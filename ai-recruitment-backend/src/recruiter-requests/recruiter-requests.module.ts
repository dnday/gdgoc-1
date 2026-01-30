import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../prisma.service';
import { RecruiterRequestsController } from './recruiter-requests.controller';
import { RecruiterRequestsService } from './recruiter-requests.service';

@Module({
  imports: [EmailModule],
  controllers: [RecruiterRequestsController],
  providers: [RecruiterRequestsService, PrismaService],
})
export class RecruiterRequestsModule {}
