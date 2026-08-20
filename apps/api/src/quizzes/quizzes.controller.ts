import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuizzesService } from './quizzes.service';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

export class SubmitAttemptDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    description: 'Map of questionId to selected choice index',
  })
  @IsNotEmpty()
  @IsObject()
  answers!: Record<string, number>;
}

@ApiTags('quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('lessons/:lessonId')
  @ApiOkResponse({ description: 'Lesson quiz retrieved.' })
  getQuizByLessonId(@Param('lessonId') lessonId: string) {
    return this.quizzesService.getQuizByLessonId(lessonId);
  }

  @Post(':id/attempt')
  @ApiOkResponse({ description: 'Quiz attempt scored and recorded.' })
  submitAttempt(
    @Param('id') quizId: string,
    @Body() body: SubmitAttemptDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.quizzesService.submitAttempt(req.user.id, quizId, body.answers);
  }
}
