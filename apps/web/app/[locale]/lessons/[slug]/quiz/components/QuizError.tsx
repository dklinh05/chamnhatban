'use client';

import React from 'react';

interface QuizErrorProps {
  error: string;
  onBack: () => void;
}

export default function QuizError({ error, onBack }: QuizErrorProps) {
  return (
    <div className="quiz-error-container">
      <div className="quiz-error-card">
        <div className="quiz-error-icon">!</div>
        <h2 className="quiz-error-title">Đã xảy ra lỗi</h2>
        <p className="quiz-error-message">{error}</p>
        <button onClick={onBack} className="btn-complete">
          Quay lại bài học
        </button>
      </div>
    </div>
  );
}
