'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  order: number;
}

interface QuizData {
  id: string;
  lessonId: string;
  titleVi: string;
  titleEn: string;
  titleJa: string;
  questions: Question[];
}

interface AttemptReview {
  correct: boolean;
  correctOptionIndex: number;
  explanationVi: string | null;
  explanationEn: string | null;
}

interface AttemptResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  review: Record<string, AttemptReview>;
}

export function useQuiz(
  slug: string,
  apiFetch: (path: string, options?: RequestInit) => Promise<Response>
) {
  const [lesson, setLesson] = useState<any | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const lessonRes = await apiFetch(`/content/lessons/${slug}`);
        if (lessonRes.status === 404) {
          setError('Bài học không tồn tại.');
          setIsLoading(false);
          return;
        }

        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          setLesson(lessonData);

          const quizRes = await apiFetch(`/quizzes/lessons/${lessonData.id}`);
          if (quizRes.ok) {
            const quizData = await quizRes.json();
            setQuiz(quizData);
          } else {
            setError('Không tìm thấy bài kiểm tra cho bài học này.');
          }
        } else {
          setError('Lỗi khi tải dữ liệu bài học.');
        }
      } catch (e) {
        setError('Không thể kết nối đến server.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [slug]);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (!quiz || selectedOption === null) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
    setSelectedOption(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!quiz || selectedOption === null) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const finalAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(finalAnswers);

    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (res.ok) {
        const result = await res.json();
        setAttemptResult(result);
      } else {
        setError('Nộp bài thất bại, vui lòng thử lại.');
      }
    } catch (e) {
      setError('Lỗi kết nối khi nộp bài.');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setAttemptResult(null);
  };

  return {
    lesson,
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
  };
}
