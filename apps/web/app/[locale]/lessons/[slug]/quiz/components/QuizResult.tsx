'use client';

import React from 'react';

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  order: number;
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

interface QuizResultProps {
  quizTitle: string;
  locale: string;
  attemptResult: AttemptResult;
  questions: Question[];
  userAnswers: Record<string, number>;
  onRetry: () => void;
  onBack: () => void;
}

export default function QuizResult({
  quizTitle,
  locale,
  attemptResult,
  questions,
  userAnswers,
  onRetry,
  onBack,
}: QuizResultProps) {
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-result-header">
          <span className="quiz-result-meta">Kết quả kiểm tra</span>
          <h1 className="quiz-result-title">{quizTitle}</h1>
        </div>

        <div className="quiz-score-banner">
          <div className="quiz-score-circle-wrapper">
            <div className={`quiz-score-circle-bg ${attemptResult.passed ? 'pass' : 'fail'}`}></div>
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
              const userAnswerIndex = userAnswers[q.id];
              const isCorrect = reviewItem?.correct;

              return (
                <div key={q.id} className="quiz-review-item">
                  <div className="quiz-review-question-row">
                    <h4 className="quiz-review-question-text">
                      {q.order}. {q.questionText}
                    </h4>
                    <span
                      className={`quiz-review-status-badge ${isCorrect ? 'correct' : 'incorrect'}`}
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
                      <p>{locale === 'vi' ? reviewItem.explanationVi : reviewItem.explanationEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="quiz-action-buttons">
          <button onClick={onRetry} className="btn-secondary flex-1">
            Làm lại bài kiểm tra
          </button>
          <button onClick={onBack} className="btn-complete flex-1">
            Quay lại bài học
          </button>
        </div>
      </div>
    </div>
  );
}
