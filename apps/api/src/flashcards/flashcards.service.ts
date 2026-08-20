import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class FlashcardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  async getStats(userId: string) {
    const now = new Date();
    const dueCount = await this.prisma.flashcard.count({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
    });

    const activeCount = await this.prisma.flashcard.count({
      where: {
        userId,
        repetitions: {
          gt: 0,
        },
      },
    });

    const totalCount = await this.prisma.flashcard.count({
      where: {
        userId,
      },
    });

    return { dueCount, activeCount, totalCount };
  }

  async getDueCards(userId: string) {
    const now = new Date();
    return this.prisma.flashcard.findMany({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
      include: {
        item: true,
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
    });
  }

  async reviewCard(userId: string, cardId: string, score: number) {
    const card = await this.prisma.flashcard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== userId) {
      throw new NotFoundException('Flashcard not found.');
    }

    let interval = card.interval;
    let easeFactor = card.easeFactor;
    let repetitions = card.repetitions;

    // SM-2 Spaced Repetition Logic
    if (score === 1) {
      // Again (forgot / quality = 1)
      const q = 1;
      easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      easeFactor = Math.max(1.3, easeFactor);
      repetitions = 0;
      interval = 1;
    } else {
      // Correct answers: score = 4 (Good), 5 (Easy)
      const q = score;
      easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      easeFactor = Math.max(1.3, easeFactor);

      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    // Save changes
    const updated = await this.prisma.flashcard.update({
      where: { id: cardId },
      data: {
        interval,
        easeFactor,
        repetitions,
        nextReviewAt,
        lastReviewedAt: new Date(),
      },
      include: {
        item: true,
      },
    });

    // Record learner timezone-aware daily activity streak
    await this.progress.recordDailyActivity(userId);

    return updated;
  }
}
