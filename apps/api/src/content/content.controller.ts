import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../admin/guards/admin-role.guard';
import { ContentService } from './content.service';
import { CreateContentItemDto, UpdateContentItemDto } from './dto/content-item.dto';
import { CreateContentLessonDto, UpdateContentLessonDto } from './dto/content-lesson.dto';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

@ApiTags('admin-content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/content/lessons')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Content lesson created.' })
  createLesson(@Body() dto: CreateContentLessonDto) {
    return this.contentService.createLesson(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Content lessons returned.' })
  listLessons() {
    return this.contentService.listLessons();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Content lesson returned.' })
  getLesson(@Param('id') id: string) {
    return this.contentService.getLesson(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Content lesson updated.' })
  updateLesson(@Param('id') id: string, @Body() dto: UpdateContentLessonDto) {
    return this.contentService.updateLesson(id, dto);
  }

  @Post(':id/items')
  @ApiCreatedResponse({ description: 'Content item created.' })
  createItem(@Param('id') id: string, @Body() dto: CreateContentItemDto) {
    return this.contentService.createItem(id, dto);
  }

  @Patch(':id/items/:itemId')
  @ApiOkResponse({ description: 'Content item updated.' })
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateContentItemDto
  ) {
    return this.contentService.updateItem(id, itemId, dto);
  }

  @Post(':id/publish')
  @ApiOkResponse({ description: 'Content lesson published.' })
  publishLesson(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.contentService.publishLesson(id, req.user.id);
  }

  @Post(':id/archive')
  @ApiOkResponse({ description: 'Content lesson archived.' })
  archiveLesson(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.contentService.archiveLesson(id, req.user.id);
  }
}
