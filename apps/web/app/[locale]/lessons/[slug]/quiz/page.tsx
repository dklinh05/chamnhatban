'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../../../auth-context';
import QuizActive from './components/QuizActive';
import QuizError from './components/QuizError';
import QuizLoading from './components/QuizLoading';
import QuizResult from './components/QuizResult';
import { useQuiz } from './hooks/useQuiz';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  const {
    quiz,
    isLoading,
    error,
    currentQuestionIndex,
    answers,
    selectedOption,
    isSubmitting,
    attemptResult,
    handleSelectOption,
    handleNext,
    handleSubmit,
    handleRetry,
  } = useQuiz(slug, apiFetch);

  if (isLoading || isAuthLoading) {
    return <QuizLoading />;
  }

  if (error) {
    return <QuizError error={error} onBack={() => router.push(`/${locale}/lessons/${slug}`)} />;
  }

  if (!quiz) return null;

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const quizTitle = locale === 'vi' ? quiz.titleVi : locale === 'ja' ? quiz.titleJa : quiz.titleEn;

  if (attemptResult) {
    return (
      <QuizResult
        quizTitle={quizTitle}
        locale={locale}
        attemptResult={attemptResult}
        questions={questions}
        userAnswers={answers}
        onRetry={handleRetry}
        onBack={() => router.push(`/${locale}/lessons/${slug}`)}
      />
    );
  }

  return (
    <QuizActive
      quizTitle={quizTitle}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      currentQuestion={currentQuestion}
      selectedOption={selectedOption}
      isSubmitting={isSubmitting}
      onSelectOption={handleSelectOption}
      onCancel={() => router.push(`/${locale}/lessons/${slug}`)}
      onNext={handleNext}
      onSubmit={handleSubmit}
    />
  );
}
