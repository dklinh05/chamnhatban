'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../auth-context';

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

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const { user, isLoading: isAuthLoading } = useAuth();

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
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const loadQuizData = async () => {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
          const token = localStorage.getItem('token');

          const apiFetch = async (path: string) => {
            return fetch(`${apiBaseUrl}${path}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          };

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
    }
  }, [user, slug]);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (!quiz || selectedOption === null) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const token = localStorage.getItem('token');

      const res = await fetch(`${apiBaseUrl}/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  if (isLoading || isAuthLoading) {
    return (
      <div className="quiz-loading-container">
        <div className="quiz-loader"></div>
        <p className="quiz-loading-text">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error-container">
        <div className="quiz-error-card">
          <div className="quiz-error-icon">!</div>
          <h2 className="quiz-error-title">Đã xảy ra lỗi</h2>
          <p className="quiz-error-message">{error}</p>
          <button
            onClick={() => router.push(`/${locale}/lessons/${slug}`)}
            className="btn-complete"
          >
            Quay lại bài học
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const questions = quiz.questions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];

  // Result view
  if (attemptResult) {
    const title = locale === 'vi' ? quiz.titleVi : locale === 'ja' ? quiz.titleJa : quiz.titleEn;
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-result-header">
            <span className="quiz-result-meta">Kết quả kiểm tra</span>
            <h1 className="quiz-result-title">{title}</h1>
          </div>

          <div className="quiz-score-banner">
            <div className="quiz-score-circle-wrapper">
              <div
                className={`quiz-score-circle-bg ${attemptResult.passed ? 'pass' : 'fail'}`}
              ></div>
              <div className="quiz-score-circle-text">
                <span className="quiz-score-percent">{attemptResult.score}%</span>
                <span className="quiz-score-label">Điểm số</span>
              </div>
            </div>

            <div className="quiz-score-info">
              <div className="quiz-badge-container">
                <span className={`quiz-status-badge ${attemptResult.passed ? 'pass' : 'fail'}`}>
                  {attemptResult.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                </span>
              </div>
              <p className="quiz-result-description">
                {attemptResult.passed
                  ? 'Chúc mừng! Bạn đã vượt qua bài kiểm tra và hoàn thành bài học.'
                  : 'Hãy cố gắng ôn tập lại nội dung bài học và làm lại để đạt tối thiểu 80% nhé.'}
              </p>
              <div className="quiz-result-summary-stats">
                Đúng {attemptResult.correctCount} / {attemptResult.totalCount} câu hỏi
              </div>
            </div>
          </div>

          <div className="quiz-review-section">
            <h3 className="quiz-review-title">Chi tiết câu hỏi</h3>
            <div className="quiz-review-list">
              {questions.map((q) => {
                const reviewItem = attemptResult.review[q.id];
                const userAnswerIndex = answers[q.id];
                const isCorrect = reviewItem?.correct;

                return (
                  <div key={q.id} className="quiz-review-item">
                    <div className="quiz-review-question-row">
                      <h4 className="quiz-review-question-text">
                        {q.order}. {q.questionText}
                      </h4>
                      <span
                        className={`quiz-review-status-badge ${
                          isCorrect ? 'correct' : 'incorrect'
                        }`}
                      >
                        {isCorrect ? 'Đúng' : 'Sai'}
                      </span>
                    </div>

                    <div className="quiz-review-options-grid">
                      {q.options.map((option, idx) => {
                        const isUserSelected = userAnswerIndex === idx;
                        const isCorrectAnswer = reviewItem?.correctOptionIndex === idx;

                        let optionClass = '';
                        if (isCorrectAnswer) {
                          optionClass = 'correct';
                        } else if (isUserSelected && !isCorrect) {
                          optionClass = 'wrong';
                        }

                        return (
                          <div key={idx} className={`quiz-review-option-card ${optionClass}`}>
                            <span className="quiz-review-option-number">{idx + 1}</span>
                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {(reviewItem?.explanationVi || reviewItem?.explanationEn) && (
                      <div className="quiz-review-explanation-box">
                        <span className="quiz-review-explanation-title">Giải thích:</span>
                        <p>
                          {locale === 'vi' ? reviewItem.explanationVi : reviewItem.explanationEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="quiz-action-buttons">
            <button onClick={handleRetry} className="btn-secondary flex-1">
              Làm lại bài kiểm tra
            </button>
            <button
              onClick={() => router.push(`/${locale}/lessons/${slug}`)}
              className="btn-complete flex-1"
            >
              Quay lại bài học
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const quizTitle = locale === 'vi' ? quiz.titleVi : locale === 'ja' ? quiz.titleJa : quiz.titleEn;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-active-header">
          <div className="quiz-active-meta">
            <span>Bài kiểm tra</span>
            <span>
              Câu hỏi {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <h1 className="quiz-active-title">{quizTitle}</h1>
        </div>

        {/* Step Progress Bar */}
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* Question Panel */}
        <div className="quiz-question-panel">
          <div className="quiz-question-box">
            <h2 className="quiz-question-label">{currentQuestion.questionText}</h2>
          </div>

          <div className="quiz-choices-list">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`quiz-choice-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="quiz-choice-number">{idx + 1}</span>
                  <span className="quiz-choice-text">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions bar */}
        <div className="quiz-action-buttons">
          <button
            onClick={() => router.push(`/${locale}/lessons/${slug}`)}
            className="btn-secondary flex-1"
          >
            Hủy bỏ
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className="btn-complete flex-1"
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="btn-complete flex-1"
            >
              Câu tiếp theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
