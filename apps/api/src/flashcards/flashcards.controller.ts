import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FlashcardsService } from './flashcards.service';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

export class ReviewCardDto {
  @ApiProperty({ enum: [1, 4, 5], description: 'Quality score: 1 (Again), 4 (Good), 5 (Easy)' })
  @IsIn([1, 4, 5])
  score!: number;
}

@ApiTags('flashcards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('stats')
  @ApiOkResponse({ description: 'Learner flashcard stats returned.' })
  getStats(@Req() req: AuthenticatedRequest) {
    return this.flashcardsService.getStats(req.user.id);
  }

  @Get('due')
  @ApiOkResponse({ description: 'Due flashcards list returned.' })
  getDueCards(@Req() req: AuthenticatedRequest) {
    return this.flashcardsService.getDueCards(req.user.id);
  }

  @Post(':id/review')
  @ApiOkResponse({ description: 'Flashcard review submitted and scheduling updated.' })
  reviewCard(
    @Param('id') cardId: string,
    @Body() body: ReviewCardDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.flashcardsService.reviewCard(req.user.id, cardId, body.score);
  }
}
