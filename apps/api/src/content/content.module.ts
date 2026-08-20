import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentController } from './content.controller';
import { ContentLearnerController } from './content-learner.controller';
import { ContentService } from './content.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContentController, ContentLearnerController],
  providers: [ContentService],
})
export class ContentModule {}
