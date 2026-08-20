import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgressOverview(userId: string) {
    const [user, progresses] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          currentStreak: true,
          longestStreak: true,
          lastActiveDate: true,
        },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId },
        select: { lessonId: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      completedLessonIds: progresses.map((p) => p.lessonId),
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
    };
  }

  async completeLesson(userId: string, lessonId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const lesson = await this.prisma.contentLesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson || lesson.status !== 'PUBLISHED') {
      throw new NotFoundException('Published lesson not found.');
    }

    const timezone = user.timezone || 'Asia/Ho_Chi_Minh';
    const localDateStr = this.getLocalDateString(timezone);

    return this.prisma.$transaction(async (tx) => {
      // 1. Add LessonProgress if not exists
      const existingProgress = await tx.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId },
        },
      });

      if (!existingProgress) {
        await tx.lessonProgress.create({
          data: { userId, lessonId },
        });
      }

      // Generate flashcards for all published content items in the lesson
      const items = await tx.contentItem.findMany({
        where: { lessonId, status: 'PUBLISHED' },
        select: { id: true },
      });

      for (const item of items) {
        const existingCard = await tx.flashcard.findUnique({
          where: {
            userId_itemId: { userId, itemId: item.id },
          },
        });
        if (!existingCard) {
          await tx.flashcard.create({
            data: { userId, itemId: item.id },
          });
        }
      }

      // 2. Add DailyActivity and update streak if first activity today
      const existingActivity = await tx.dailyActivity.findUnique({
        where: {
          userId_date: { userId, date: localDateStr },
        },
      });

      let currentStreak = user.currentStreak;
      let longestStreak = user.longestStreak;
      let lastActiveDate = user.lastActiveDate;

      if (!existingActivity) {
        await tx.dailyActivity.create({
          data: { userId, date: localDateStr },
        });

        const yesterdayDateStr = this.getYesterdayDateString(timezone, localDateStr);

        if (user.lastActiveDate === yesterdayDateStr) {
          currentStreak = user.currentStreak + 1;
        } else if (user.lastActiveDate === localDateStr) {
          currentStreak = user.currentStreak;
        } else {
          currentStreak = 1;
        }

        longestStreak = Math.max(user.longestStreak, currentStreak);
        lastActiveDate = localDateStr;

        await tx.user.update({
          where: { id: userId },
          data: {
            currentStreak,
            longestStreak,
            lastActiveDate,
          },
        });
      }

      return {
        completed: true,
        currentStreak,
        longestStreak,
        lastActiveDate,
      };
    });
  }

  async recordDailyActivity(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return;
    const timezone = user.timezone || 'Asia/Ho_Chi_Minh';
    const localDateStr = this.getLocalDateString(timezone);

    await this.prisma.$transaction(async (tx) => {
      const existingActivity = await tx.dailyActivity.findUnique({
        where: {
          userId_date: { userId, date: localDateStr },
        },
      });
      if (!existingActivity) {
        await tx.dailyActivity.create({
          data: { userId, date: localDateStr },
        });

        const yesterdayDateStr = this.getYesterdayDateString(timezone, localDateStr);
        let currentStreak = user.currentStreak;

        if (user.lastActiveDate === yesterdayDateStr) {
          currentStreak = user.currentStreak + 1;
        } else if (user.lastActiveDate === localDateStr) {
          currentStreak = user.currentStreak;
        } else {
          currentStreak = 1;
        }

        const longestStreak = Math.max(user.longestStreak, currentStreak);
        const lastActiveDate = localDateStr;

        await tx.user.update({
          where: { id: userId },
          data: {
            currentStreak,
            longestStreak,
            lastActiveDate,
          },
        });
      }
    });
  }

  // Exposed helper methods for testing
  getLocalDateString(timezone: string, date: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  getYesterdayDateString(timezone: string, currentDateStr: string): string {
    const [year, month, day] = currentDateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - 1);
    return this.getLocalDateString(timezone, date);
  }
}
