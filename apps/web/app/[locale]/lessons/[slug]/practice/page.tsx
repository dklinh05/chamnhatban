'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../auth-context';
import { useParams, useRouter } from 'next/navigation';

type ContentItem = {
  id: string;
  slug: string;
  type: string;
  order: number;
  sourceJa: string;
  reading: string | null;
  meaningVi: string;
  meaningEn: string;
  meaningJa: string;
};

type LessonDetails = {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  titleJa: string;
  items: ContentItem[];
};

type QuestionType = 'kana-to-romaji' | 'romaji-to-kana' | 'type-romaji';

type Question = {
  type: QuestionType;
  prompt: string; // The prompt shown to user (e.g. "あ" or "a")
  correctAnswer: string; // The correct option/value
  options: string[]; // Array of 4 options (for multiple choice)
  character: string; // The base Hiragana character
};

export default function PracticePage() {
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;

  const isKatakana = slug.startsWith('katakana-');
  const backPath = `/${locale}/${isKatakana ? 'katakana' : 'hiragana'}`;

  const [lesson, setLesson] = useState<LessonDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const fetchLessonData = async () => {
        try {
          const res = await apiFetch(`/content/lessons/${slug}`);
          if (res.status === 404) {
            setError('Bài học không tồn tại hoặc chưa được xuất bản.');
            return;
          }
          if (res.ok) {
            const data = await res.json();
            setLesson(data);
            generateQuestions(data.items);
          } else {
            setError('Có lỗi xảy ra khi tải bài học.');
          }
        } catch (e) {
          setError('Không thể kết nối tới server.');
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLessonData();
    }
  }, [user, slug]);

  const generateQuestions = (items: ContentItem[]) => {
    if (!items || items.length === 0) return;

    const generated: Question[] = [];
    const kanaItems = items.filter((item) => item.type === 'KANA');

    if (kanaItems.length === 0) {
      setError('Bài học này không chứa chữ cái để luyện tập.');
      return;
    }

    // Shuffle helper
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // Get all romaji and characters in this row for options
    const allRomaji = kanaItems.map((item) => item.reading || '');
    const allChars = kanaItems.map((item) => item.sourceJa);

    kanaItems.forEach((item) => {
      const char = item.sourceJa;
      const romaji = item.reading || '';

      // 1. Question Type: Kana to Romaji (Multiple Choice)
      let romajiOptions = [romaji];
      const otherRomaji = allRomaji.filter((r) => r !== romaji);
      const shuffledOthers = shuffle(otherRomaji);
      // Fill options to make 4
      for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
        romajiOptions.push(shuffledOthers[i]);
      }
      // If we don't have enough options, add some standard noise
      const noise = [
        'a',
        'i',
        'u',
        'e',
        'o',
        'ka',
        'ki',
        'ku',
        'ke',
        'ko',
        'sa',
        'shi',
        'su',
        'se',
        'so',
      ];
      while (romajiOptions.length < 4) {
        const randomNoise = noise[Math.floor(Math.random() * noise.length)];
        if (!romajiOptions.includes(randomNoise)) {
          romajiOptions.push(randomNoise);
        }
      }
      romajiOptions = shuffle(romajiOptions);

      generated.push({
        type: 'kana-to-romaji',
        prompt: char,
        correctAnswer: romaji,
        options: romajiOptions,
        character: char,
      });

      // 2. Question Type: Romaji to Kana (Multiple Choice)
      let kanaOptions = [char];
      const otherChars = allChars.filter((c) => c !== char);
      const shuffledChars = shuffle(otherChars);
      for (let i = 0; i < 3 && i < shuffledChars.length; i++) {
        kanaOptions.push(shuffledChars[i]);
      }
      // Fill noise
      const noiseChars = [
        'あ',
        'い',
        'う',
        'え',
        'お',
        'か',
        'き',
        'く',
        'け',
        'こ',
        'さ',
        'し',
        'す',
        'せ',
        'そ',
      ];
      while (kanaOptions.length < 4) {
        const randomNoise = noiseChars[Math.floor(Math.random() * noiseChars.length)];
        if (!kanaOptions.includes(randomNoise)) {
          kanaOptions.push(randomNoise);
        }
      }
      kanaOptions = shuffle(kanaOptions);

      generated.push({
        type: 'romaji-to-kana',
        prompt: romaji,
        correctAnswer: char,
        options: kanaOptions,
        character: char,
      });

      // 3. Question Type: Type Romaji (Text Input)
      generated.push({
        type: 'type-romaji',
        prompt: char,
        correctAnswer: romaji,
        options: [],
        character: char,
      });
    });

    // Randomize the entire question set and take up to 8 questions
    const finalSet = shuffle(generated).slice(0, 8);
    setQuestions(finalSet);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option === questions[currentIdx].correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
      playFeedbackSound(true);
    } else {
      playFeedbackSound(false);
    }
  };

  const handleSubmitTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;
    const ans = typedAnswer.trim().toLowerCase();
    const correct = ans === questions[currentIdx].correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
      playFeedbackSound(true);
    } else {
      playFeedbackSound(false);
    }
  };

  const playFeedbackSound = (correct: boolean) => {
    // Simple synthesized beeps as lightweight feedback audio placeholders
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (correct) {
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } else {
          osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 note
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {
        // Audio context may be blocked by browser autoplay policy
      }
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setTypedAnswer('');

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setPracticeCompleted(true);
      submitProgress();
    }
  };

  const submitProgress = async () => {
    if (!lesson) return;
    const finalPassing = score >= Math.ceil(questions.length * 0.8);
    if (!finalPassing) return; // Didn't pass, don't record progress

    setIsSubmittingProgress(true);
    try {
      await apiFetch(`/progress/lessons/${lesson.id}/complete`, {
        method: 'POST',
      });
    } catch (e) {
      console.error('Failed to update progress', e);
    } finally {
      setIsSubmittingProgress(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải câu hỏi luyện tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Lỗi</h2>
          <p>{error}</p>
          <a href={backPath} className="btn-primary">
            Quay lại bảng chữ cái
          </a>
        </div>
      </div>
    );
  }

  if (!user || !lesson || questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const percentProgress = (currentIdx / questions.length) * 100;
  const isPassing = score >= Math.ceil(questions.length * 0.8);

  return (
    <div className="lesson-layout">
      {/* Top Navbar */}
      <nav className="lesson-nav">
        <a href={backPath} className="back-link">
          ← Quay lại bảng chữ cái
        </a>
        <div className="lesson-title-area">
          <span className="lesson-tag">Luyện tập hàng</span>
          <h2>
            {locale === 'vi' ? lesson.titleVi : locale === 'ja' ? lesson.titleJa : lesson.titleEn}
          </h2>
        </div>
        <div style={{ width: '80px' }}></div>
      </nav>

      {/* Main Panel */}
      <main
        className="practice-main"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {!practiceCompleted ? (
          <div className="practice-container">
            {/* Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: 'var(--color-muted)',
                  fontWeight: '600',
                }}
              >
                <span>Tiến trình luyện tập</span>
                <span>
                  Câu {currentIdx + 1} / {questions.length}
                </span>
              </div>
              <div className="practice-progress-bar-container">
                <div
                  className="practice-progress-bar-fill"
                  style={{ width: `${percentProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="practice-question-card">
              {currentQuestion.type === 'kana-to-romaji' && (
                <>
                  <span className="prompt-title">
                    Chọn cách phát âm Romaji đúng cho chữ kana này:
                  </span>
                  <span className="prompt-character">{currentQuestion.prompt}</span>

                  <div className="practice-options-grid">
                    {currentQuestion.options.map((opt) => {
                      let btnClass = '';
                      if (isAnswered) {
                        if (opt === currentQuestion.correctAnswer) {
                          btnClass = 'selected-correct';
                        } else if (opt === selectedOption) {
                          btnClass = 'selected-incorrect';
                        }
                      }
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(opt)}
                          disabled={isAnswered}
                          className={`option-btn ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {currentQuestion.type === 'romaji-to-kana' && (
                <>
                  <span className="prompt-title">Chọn chữ kana tương ứng cho phát âm:</span>
                  <span className="prompt-character" style={{ color: 'var(--color-accent-hover)' }}>
                    {currentQuestion.prompt}
                  </span>

                  <div className="practice-options-grid">
                    {currentQuestion.options.map((opt) => {
                      let btnClass = '';
                      if (isAnswered) {
                        if (opt === currentQuestion.correctAnswer) {
                          btnClass = 'selected-correct';
                        } else if (opt === selectedOption) {
                          btnClass = 'selected-incorrect';
                        }
                      }
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(opt)}
                          disabled={isAnswered}
                          className={`option-btn ${btnClass}`}
                          style={{ fontSize: '24px' }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {currentQuestion.type === 'type-romaji' && (
                <>
                  <span className="prompt-title">Nhập phát âm Romaji đúng cho chữ cái này:</span>
                  <span className="prompt-character">{currentQuestion.prompt}</span>

                  <form onSubmit={handleSubmitTyped} className="input-answer-container">
                    <input
                      type="text"
                      className="input-answer"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      disabled={isAnswered}
                      placeholder="Nhập romaji..."
                      autoFocus
                    />
                    {!isAnswered && (
                      <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                        Kiểm tra câu trả lời
                      </button>
                    )}
                  </form>
                </>
              )}

              {/* Feedback Alert Box */}
              {isAnswered && (
                <div style={{ width: '100%' }}>
                  <div
                    className={`practice-feedback-box ${
                      isCorrect ? 'feedback-correct' : 'feedback-incorrect'
                    }`}
                  >
                    {isCorrect ? (
                      <span>🎉 Chính xác! Tuyệt vời.</span>
                    ) : (
                      <span>
                        ❌ Chưa chính xác. Đáp án đúng là:{' '}
                        <strong>{currentQuestion.correctAnswer}</strong>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '16px' }}
                  >
                    Tiếp tục →
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="practice-container" style={{ textAlign: 'center' }}>
            <div className="practice-question-card" style={{ gap: '20px' }}>
              <span style={{ fontSize: '64px' }}>{isPassing ? '🎉' : '📚'}</span>
              <h2>Kết quả Luyện tập</h2>
              <p style={{ fontSize: '18px', color: 'var(--color-muted)' }}>
                Bạn đã trả lời đúng <strong>{score}</strong> trên tổng số{' '}
                <strong>{questions.length}</strong> câu hỏi.
              </p>

              <div
                style={{
                  margin: '16px 0',
                  width: '100%',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '20px',
                }}
              >
                {isPassing ? (
                  <div
                    className="practice-feedback-box feedback-correct"
                    style={{ fontSize: '14px' }}
                  >
                    Chúc mừng! Bạn đã hoàn thành xuất sắc bài luyện tập (Đạt{' '}
                    {Math.round((score / questions.length) * 100)}%). Tiến trình của bạn đã được ghi
                    lại và streak của bạn đã được cập nhật!
                  </div>
                ) : (
                  <div
                    className="practice-feedback-box feedback-incorrect"
                    style={{ fontSize: '14px' }}
                  >
                    Bạn cần đạt ít nhất 80% câu trả lời đúng (tương đương{' '}
                    {Math.ceil(questions.length * 0.8)} câu) để hoàn thành hàng này. Hãy thử lại
                    nhé!
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  onClick={() => router.push(backPath)}
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={isSubmittingProgress}
                >
                  Quay lại Bảng chữ cái
                </button>
                {!isPassing && (
                  <button
                    onClick={() => {
                      setCurrentIdx(0);
                      setScore(0);
                      setPracticeCompleted(false);
                      generateQuestions(lesson.items);
                    }}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
