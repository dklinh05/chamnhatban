'use client';

import React from 'react';

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  order: number;
}

interface QuizActiveProps {
  quizTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  selectedOption: number | null;
  isSubmitting: boolean;
  onSelectOption: (index: number) => void;
  onCancel: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuizActive({
  quizTitle,
  currentQuestionIndex,
  totalQuestions,
  currentQuestion,
  selectedOption,
  isSubmitting,
  onSelectOption,
  onCancel,
  onNext,
  onSubmit,
}: QuizActiveProps) {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-active-header">
          <div className="quiz-active-meta">
            <span>Bài kiểm tra</span>
            <span>
              Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}
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
                  onClick={() => onSelectOption(idx)}
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
          <button onClick={onCancel} className="btn-secondary flex-1">
            Hủy bỏ
          </button>

          {isLastQuestion ? (
            <button
              onClick={onSubmit}
              disabled={selectedOption === null || isSubmitting}
              className="btn-complete flex-1"
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          ) : (
            <button
              onClick={onNext}
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
