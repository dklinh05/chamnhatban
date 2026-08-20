import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContentService } from './content.service';

@ApiTags('content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content/lessons')
export class ContentLearnerController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOkResponse({ description: 'Published content lessons returned.' })
  listPublishedLessons() {
    return this.contentService.listPublishedLessons();
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Published content lesson returned.' })
  getPublishedLessonBySlug(@Param('slug') slug: string) {
    return this.contentService.getPublishedLessonBySlug(slug);
  }
}
