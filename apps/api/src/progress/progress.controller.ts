import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOkResponse({ description: 'Learner progress overview returned.' })
  getProgressOverview(@Req() req: AuthenticatedRequest) {
    return this.progressService.getProgressOverview(req.user.id);
  }

  @Post('lessons/:lessonId/complete')
  @ApiOkResponse({ description: 'Lesson completion recorded and streak updated.' })
  completeLesson(@Param('lessonId') lessonId: string, @Req() req: AuthenticatedRequest) {
    return this.progressService.completeLesson(req.user.id, lessonId);
  }
}
