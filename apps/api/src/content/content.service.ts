import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentItemDto, UpdateContentItemDto } from './dto/content-item.dto';
import { CreateContentLessonDto, UpdateContentLessonDto } from './dto/content-lesson.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async createLesson(dto: CreateContentLessonDto) {
    try {
      return await this.prisma.contentLesson.create({
        data: {
          slug: dto.slug,
          titleVi: dto.titleVi,
          titleEn: dto.titleEn,
          titleJa: dto.titleJa,
          descriptionVi: dto.descriptionVi,
          descriptionEn: dto.descriptionEn,
          descriptionJa: dto.descriptionJa,
          order: dto.order,
          items: dto.items
            ? {
                create: dto.items.map((item) => ({
                  slug: item.slug,
                  type: item.type,
                  order: item.order,
                  sourceJa: item.sourceJa,
                  reading: item.reading,
                  meaningVi: item.meaningVi,
                  meaningEn: item.meaningEn,
                  meaningJa: item.meaningJa,
                  notesVi: item.notesVi,
                  notesEn: item.notesEn,
                  notesJa: item.notesJa,
                })),
              }
            : undefined,
        },
        include: this.lessonInclude,
      });
    } catch (error) {
      this.throwKnownWriteError(error);
      throw error;
    }
  }

  async listLessons() {
    return this.prisma.contentLesson.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getLesson(id: string) {
    const lesson = await this.prisma.contentLesson.findUnique({
      where: { id },
      include: this.lessonInclude,
    });

    if (!lesson) {
      throw new NotFoundException('Content lesson was not found.');
    }

    return lesson;
  }

  async updateLesson(id: string, dto: UpdateContentLessonDto) {
    await this.getLesson(id);

    try {
      return await this.prisma.contentLesson.update({
        where: { id },
        data: {
          slug: dto.slug,
          titleVi: dto.titleVi,
          titleEn: dto.titleEn,
          titleJa: dto.titleJa,
          descriptionVi: dto.descriptionVi,
          descriptionEn: dto.descriptionEn,
          descriptionJa: dto.descriptionJa,
          order: dto.order,
        },
        include: this.lessonInclude,
      });
    } catch (error) {
      this.throwKnownWriteError(error);
      throw error;
    }
  }

  async createItem(lessonId: string, dto: CreateContentItemDto) {
    await this.getLesson(lessonId);

    try {
      return await this.prisma.contentItem.create({
        data: {
          lessonId,
          slug: dto.slug,
          type: dto.type,
          order: dto.order,
          sourceJa: dto.sourceJa,
          reading: dto.reading,
          meaningVi: dto.meaningVi,
          meaningEn: dto.meaningEn,
          meaningJa: dto.meaningJa,
          notesVi: dto.notesVi,
          notesEn: dto.notesEn,
          notesJa: dto.notesJa,
        },
      });
    } catch (error) {
      this.throwKnownWriteError(error);
      throw error;
    }
  }

  async updateItem(lessonId: string, itemId: string, dto: UpdateContentItemDto) {
    await this.getLesson(lessonId);

    const existing = await this.prisma.contentItem.findFirst({
      where: { id: itemId, lessonId },
    });

    if (!existing) {
      throw new NotFoundException('Content item was not found.');
    }

    try {
      return await this.prisma.contentItem.update({
        where: { id: itemId },
        data: {
          slug: dto.slug,
          type: dto.type,
          order: dto.order,
          sourceJa: dto.sourceJa,
          reading: dto.reading,
          meaningVi: dto.meaningVi,
          meaningEn: dto.meaningEn,
          meaningJa: dto.meaningJa,
          notesVi: dto.notesVi,
          notesEn: dto.notesEn,
          notesJa: dto.notesJa,
        },
      });
    } catch (error) {
      this.throwKnownWriteError(error);
      throw error;
    }
  }

  async publishLesson(id: string, actorId: string) {
    const lesson = await this.getLesson(id);
    this.validatePublishableLesson(lesson);

    return this.prisma.$transaction(async (tx: PrismaService) => {
      const published = await tx.contentLesson.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          archivedAt: null,
          items: {
            updateMany: {
              where: { lessonId: id },
              data: { status: 'PUBLISHED' },
            },
          },
        },
        include: this.lessonInclude,
      });

      await tx.contentAuditLog.create({
        data: {
          lessonId: id,
          actorId,
          action: 'PUBLISH',
        },
      });

      return published;
    });
  }

  async archiveLesson(id: string, actorId: string) {
    await this.getLesson(id);

    return this.prisma.$transaction(async (tx: PrismaService) => {
      const archived = await tx.contentLesson.update({
        where: { id },
        data: {
          status: 'ARCHIVED',
          archivedAt: new Date(),
          items: {
            updateMany: {
              where: { lessonId: id },
              data: { status: 'ARCHIVED' },
            },
          },
        },
        include: this.lessonInclude,
      });

      await tx.contentAuditLog.create({
        data: {
          lessonId: id,
          actorId,
          action: 'ARCHIVE',
        },
      });

      return archived;
    });
  }

  private validatePublishableLesson(lesson: Awaited<ReturnType<ContentService['getLesson']>>) {
    if (!lesson.titleVi || !lesson.titleEn || !lesson.titleJa) {
      throw new BadRequestException('Lesson requires vi, en, and ja titles before publishing.');
    }

    if (lesson.items.length === 0) {
      throw new BadRequestException('Lesson requires at least one content item before publishing.');
    }

    for (const item of lesson.items) {
      if (!item.sourceJa || !item.meaningVi || !item.meaningEn || !item.meaningJa) {
        throw new BadRequestException(
          'Every content item requires Japanese source text and vi, en, ja meanings before publishing.'
        );
      }
    }
  }

  private throwKnownWriteError(error: unknown): never | void {
    if (isPrismaKnownRequestError(error, 'P2002')) {
      throw new ConflictException('Content slug or order already exists.');
    }
  }

  private readonly lessonInclude = {
    items: {
      orderBy: { order: 'asc' as const },
    },
    auditLogs: {
      orderBy: { createdAt: 'desc' as const },
    },
  };
}

function isPrismaKnownRequestError(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === code
  );
}
