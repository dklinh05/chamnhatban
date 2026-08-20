'use client';

import React from 'react';

export default function QuizLoading() {
  return (
    <div className="quiz-loading-container">
      <div className="quiz-loader"></div>
      <p className="quiz-loading-text">Đang tải câu hỏi...</p>
    </div>
  );
}
