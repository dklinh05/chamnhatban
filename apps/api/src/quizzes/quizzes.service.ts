import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService, private readonly progress: ProgressService) {}

  async getQuizByLessonId(lessonId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return null;
    }

    // Hide correctOptionIndex and explanations for safety
    const secureQuestions = quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      order: q.order,
    }));

    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      titleVi: quiz.titleVi,
      titleEn: quiz.titleEn,
      titleJa: quiz.titleJa,
      questions: secureQuestions,
    };
  }

  async submitAttempt(userId: string, quizId: string, answers: Record<string, number>) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found.');
    }

    const questions = quiz.questions;
    if (questions.length === 0) {
      return {
        score: 100,
        passed: true,
        correctCount: 0,
        totalCount: 0,
        review: {},
      };
    }

    let correctCount = 0;
    const review: Record<
      string,
      {
        correct: boolean;
        correctOptionIndex: number;
        explanationVi: string | null;
        explanationEn: string | null;
      }
    > = {};

    for (const q of questions) {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption === q.correctOptionIndex;

      if (isCorrect) {
        correctCount++;
      }

      review[q.id] = {
        correct: isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        explanationVi: q.explanationVi,
        explanationEn: q.explanationEn,
      };
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;

    // Save attempt history using a transaction
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          answers: answers as any,
        },
      });

      // If passing, mark lesson as completed
      if (passed) {
        const existingProgress = await tx.lessonProgress.findUnique({
          where: {
            userId_lessonId: { userId, lessonId: quiz.lessonId },
          },
        });
        if (!existingProgress) {
          // Trigger lesson progress complete logic
          await this.progress.completeLesson(userId, quiz.lessonId);
        }
      }
    });

    return {
      score,
      passed,
      correctCount,
      totalCount: questions.length,
      review,
    };
  }
}
