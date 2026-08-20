'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth-context';
import { useParams, useRouter } from 'next/navigation';

type ContentItem = {
  id: string;
  sourceJa: string;
  reading: string | null;
  meaningVi: string;
  meaningEn: string;
  meaningJa: string;
  notesVi: string | null;
  notesEn: string | null;
  notesJa: string | null;
  type: string;
};

type Flashcard = {
  id: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  item: ContentItem;
};

export default function FlashcardsReviewPage() {
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const fetchDueCards = async () => {
        try {
          const res = await apiFetch('/flashcards/due');
          if (res.ok) {
            const data = await res.json();
            setCards(data);
            setSessionCount(data.length);
          }
        } catch (e) {
          console.error('Failed to fetch due flashcards', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDueCards();
    }
  }, [user]);

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'ja-JP';
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  };

  const handleScore = async (score: number) => {
    if (isSubmitting || cards.length === 0 || currentIndex >= cards.length) return;

    setIsSubmitting(true);
    const card = cards[currentIndex];

    try {
      const res = await apiFetch(`/flashcards/${card.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });

      if (res.ok) {
        // Speak card on successful review back
        speakWord(card.item.sourceJa);

        // If card was marked 'Again' (score === 1), append to the end of review queue to review it again in this session
        if (score === 1) {
          setCards((prev) => [...prev, card]);
          setSessionCount((prev) => prev + 1);
        }

        // Animate page transitions back to un-flipped state before proceeding to next card
        setIsFlipped(false);
        window.setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsSubmitting(false);
        }, 250);
      } else {
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang chuẩn bị thẻ ghi nhớ...</p>
      </div>
    );
  }

  if (!user) return null;

  // Render review session completed/empty state
  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="dashboard-layout">
        <main className="hiragana-container" style={{ maxWidth: '600px', margin: '40px auto' }}>
          <div className="hiragana-header" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
            <h2>Tuyệt vời!</h2>
            <p className="section-desc" style={{ fontSize: '16px' }}>
              Bạn đã hoàn thành việc ôn tập tất cả các thẻ ghi nhớ đến hạn hôm nay.
            </p>
          </div>

          <div
            className="empty-state"
            style={{
              padding: '32px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'var(--color-text)' }}>
              Hãy duy trì thói quen học và ôn tập hàng ngày để ghi nhớ lâu dài!
            </p>
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              Về Trang chủ Lộ trình
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const item = currentCard.item;
  const progressPercent = Math.min(100, Math.round((currentIndex / sessionCount) * 100));

  const meaning =
    locale === 'vi' ? item.meaningVi : locale === 'ja' ? item.meaningJa : item.meaningEn;

  const notes =
    locale === 'vi' ? item.notesVi : locale === 'ja' ? item.notesJa ?? item.notesEn : item.notesEn;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-brand">
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="btn-secondary"
            style={{ marginRight: '12px' }}
          >
            {'← Thoát'}
          </button>
          <h1>Ôn tập Flashcard (SRS)</h1>
        </div>
      </header>

      <main className="hiragana-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: 'var(--color-muted)',
              marginBottom: '8px',
            }}
          >
            <span>
              Tiến trình buổi ôn tập: {currentIndex} / {sessionCount} thẻ
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div
            style={{
              height: '6px',
              background: 'var(--color-border)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#a855f7',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* Flippable card section */}
        <div className="flashcard-perspective">
          <div
            className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
            onClick={() => {
              if (!isFlipped) {
                setIsFlipped(true);
                speakWord(item.sourceJa);
              }
            }}
          >
            {/* Front Card */}
            <div className="flashcard-side flashcard-front">
              <div className="flashcard-type-badge">{item.type}</div>
              <div className="flashcard-main-text">{item.sourceJa}</div>
              <div className="flashcard-hint-click">Chạm để lật thẻ và nghe phát âm</div>
            </div>

            {/* Back Card */}
            <div className="flashcard-side flashcard-back">
              <div className="flashcard-back-header">
                <span className="flashcard-type-badge">{item.type}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(item.sourceJa);
                  }}
                  className="flashcard-back-tts-btn"
                  title="Nghe phát âm"
                >
                  🔊 Nghe
                </button>
              </div>

              <div className="flashcard-back-content">
                <div className="flashcard-back-main-char">{item.sourceJa}</div>
                {item.reading && <div className="flashcard-back-reading">{item.reading}</div>}

                <div className="flashcard-divider" />

                <div className="flashcard-detail-section">
                  <div className="flashcard-detail-label">Ý nghĩa:</div>
                  <div className="flashcard-detail-value">{meaning}</div>
                </div>

                {notes && (
                  <div className="flashcard-detail-section" style={{ marginTop: '12px' }}>
                    <div className="flashcard-detail-label">Giải thích &amp; Ví dụ:</div>
                    <div className="flashcard-detail-notes">{notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Response Action buttons (visible only when card is flipped) */}
        <div className={`flashcard-actions-wrapper ${isFlipped ? 'visible' : ''}`}>
          {isFlipped ? (
            <div className="flashcard-score-buttons">
              <button
                disabled={isSubmitting}
                onClick={() => handleScore(1)}
                className="btn-score btn-score-again"
              >
                <span className="score-lbl">Học lại</span>
                <span className="score-interval">&lt;1 phút</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleScore(4)}
                className="btn-score btn-score-good"
              >
                <span className="score-lbl">Nhớ tốt</span>
                <span className="score-interval">Mặc định</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleScore(5)}
                className="btn-score btn-score-easy"
              >
                <span className="score-lbl">Rất dễ</span>
                <span className="score-interval">Lâu hơn</span>
              </button>
            </div>
          ) : (
            <div className="flashcard-action-prompt">
              Nhấp vào thẻ ở trên để xem nghĩa và cách đọc
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
