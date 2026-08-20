'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth-context';
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
  notesVi: string | null;
  notesEn: string | null;
  notesJa: string | null;
};

type LessonDetails = {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  titleJa: string;
  descriptionVi: string | null;
  descriptionEn: string | null;
  descriptionJa: string | null;
  items: ContentItem[];
};

export default function LessonDetailPage() {
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;

  const isVocabLesson = slug.startsWith('vocab-');
  const isGrammarLesson = slug.startsWith('grammar-');
  const isKanjiLesson = slug.startsWith('kanji-');

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'ja-JP';
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  };

  const [lesson, setLesson] = useState<LessonDetails | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const fetchLessonData = async () => {
        try {
          const [lessonRes, progressRes] = await Promise.all([
            apiFetch(`/content/lessons/${slug}`),
            apiFetch('/progress'),
          ]);

          if (lessonRes.status === 404) {
            setError('Bài học không tồn tại hoặc chưa được xuất bản.');
            return;
          }

          if (lessonRes.ok && progressRes.ok) {
            const lessonData = await lessonRes.json();
            const progressData = await progressRes.json();
            setLesson(lessonData);
            setIsCompleted(progressData.completedLessonIds.includes(lessonData.id));
          } else {
            setError('Có lỗi xảy ra khi tải dữ liệu bài học.');
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

  const handleComplete = async () => {
    if (!lesson) return;
    setIsCompleting(true);
    try {
      const res = await apiFetch(`/progress/lessons/${lesson.id}/complete`, {
        method: 'POST',
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard`);
      } else {
        alert('Không thể cập nhật tiến độ học.');
      }
    } catch (e) {
      console.error(e);
      alert('Có lỗi mạng xảy ra.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải nội dung bài học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Oops!</h2>
          <p>{error}</p>
          <a href={`/${locale}/dashboard`} className="btn-primary">
            Quay lại lộ trình
          </a>
        </div>
      </div>
    );
  }

  if (!user || !lesson) return null;

  return (
    <div className="lesson-layout">
      {/* Top Bar */}
      <nav className="lesson-nav">
        <a href={`/${locale}/dashboard`} className="back-link">
          ← Quay lại lộ trình
        </a>
        <div className="lesson-title-area">
          <span className="lesson-tag">Bài học</span>
          <h2>
            {locale === 'vi' ? lesson.titleVi : locale === 'ja' ? lesson.titleJa : lesson.titleEn}
          </h2>
        </div>
        <div>
          {isCompleted && <span className="status-badge completed-badge">✓ Đã hoàn thành</span>}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lesson-main">
        {/* Lesson Intro */}
        {lesson.descriptionVi && (
          <section className="lesson-description-box">
            <p>
              {locale === 'vi'
                ? lesson.descriptionVi
                : locale === 'ja'
                ? lesson.descriptionJa
                : lesson.descriptionEn}
            </p>
          </section>
        )}

        {/* Content Items List */}
        <section className="lesson-items-section">
          <h3>Nội dung bài học ({lesson.items.length} phần)</h3>

          <div className="items-grid">
            {lesson.items.map((item) => {
              if (item.type === 'VOCABULARY') {
                return (
                  <div key={item.id} className="vocab-card">
                    <div className="vocab-word-row">
                      <span className="vocab-word">{item.sourceJa}</span>
                      {item.reading && <span className="vocab-furigana">({item.reading})</span>}
                      <button
                        onClick={() => speakWord(item.sourceJa)}
                        className="vocab-tts-btn"
                        title="Nghe phát âm"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="vocab-meaning">
                      <span className="vocab-meaning-label">Ý nghĩa:</span>
                      <span>
                        {locale === 'vi'
                          ? item.meaningVi
                          : locale === 'ja'
                          ? item.meaningJa
                          : item.meaningEn}
                      </span>
                    </div>
                    {(item.notesVi || item.notesEn) && (
                      <div className="vocab-example">
                        <span className="vocab-example-label">Ví dụ:</span>
                        <p className="vocab-example-text">
                          {locale === 'vi'
                            ? item.notesVi
                            : locale === 'ja'
                            ? item.notesJa ?? item.notesEn
                            : item.notesEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              } else if (item.type === 'GRAMMAR') {
                return (
                  <div key={item.id} className="grammar-card">
                    <div className="grammar-header-row">
                      <span className="grammar-badge-label">Ngữ pháp</span>
                      <button
                        onClick={() => speakWord(item.sourceJa)}
                        className="grammar-tts-btn"
                        title="Nghe mẫu cấu trúc"
                      >
                        🔊 Nghe mẫu
                      </button>
                    </div>
                    <div className="grammar-structure-box">
                      <span className="grammar-structure">{item.sourceJa}</span>
                      {item.reading && <span className="grammar-reading">({item.reading})</span>}
                    </div>
                    <div className="grammar-meaning">
                      <span className="grammar-meaning-label">Ý nghĩa:</span>
                      <span className="grammar-meaning-text">
                        {locale === 'vi'
                          ? item.meaningVi
                          : locale === 'ja'
                          ? item.meaningJa
                          : item.meaningEn}
                      </span>
                    </div>
                    {(item.notesVi || item.notesEn) && (
                      <div className="grammar-examples">
                        <span className="grammar-examples-label">Giải thích &amp; Ví dụ:</span>
                        <p className="grammar-examples-text">
                          {locale === 'vi'
                            ? item.notesVi
                            : locale === 'ja'
                            ? item.notesJa ?? item.notesEn
                            : item.notesEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              } else if (item.type === 'KANJI') {
                return (
                  <div key={item.id} className="kanji-card">
                    <div className="kanji-card-left">
                      <span className="kanji-char">{item.sourceJa}</span>
                      <button
                        onClick={() => speakWord(item.sourceJa)}
                        className="kanji-tts-btn"
                        title="Nghe cách đọc Kanji"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="kanji-card-right">
                      <div className="kanji-readings-row">
                        <span className="kanji-readings-label">Âm đọc:</span>
                        <span className="kanji-readings-value">{item.reading}</span>
                      </div>
                      <div className="kanji-meaning-row">
                        <span className="kanji-meaning-label">Ý nghĩa:</span>
                        <span className="kanji-meaning-value">
                          {locale === 'vi'
                            ? item.meaningVi
                            : locale === 'ja'
                            ? item.meaningJa
                            : item.meaningEn}
                        </span>
                      </div>
                      {(item.notesVi || item.notesEn) && (
                        <div className="kanji-notes-box">
                          <span className="kanji-notes-label">Chi tiết &amp; Ví dụ:</span>
                          <p className="kanji-notes-text">
                            {locale === 'vi'
                              ? item.notesVi
                              : locale === 'ja'
                              ? item.notesJa ?? item.notesEn
                              : item.notesEn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={item.id} className="item-card">
                    <div className="item-type-badge">{item.type}</div>
                    <div className="item-japanese">
                      <span className="ja-text">{item.sourceJa}</span>
                      {item.reading && <span className="ja-reading">({item.reading})</span>}
                    </div>
                    <div className="item-translation">
                      <span className="trans-title">Ý nghĩa:</span>
                      <p className="trans-text">
                        {locale === 'vi'
                          ? item.meaningVi
                          : locale === 'ja'
                          ? item.meaningJa
                          : item.meaningEn}
                      </p>
                    </div>
                    {(item.notesVi || item.notesEn || item.notesJa) && (
                      <div className="item-notes">
                        <span className="notes-title">Chú thích:</span>
                        <p className="notes-text">
                          {locale === 'vi'
                            ? item.notesVi
                            : locale === 'ja'
                            ? item.notesJa
                            : item.notesEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </section>

        {/* Complete Action Button */}
        <section
          className="lesson-actions"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className={`btn-complete ${isCompleted ? 'already-completed' : ''}`}
          >
            {isCompleting
              ? 'Đang lưu tiến độ...'
              : isCompleted
              ? 'Đã hoàn thành (Học lại)'
              : isVocabLesson
              ? 'Hoàn thành chủ đề'
              : isGrammarLesson
              ? 'Hoàn thành bài ngữ pháp'
              : isKanjiLesson
              ? 'Hoàn thành bài chữ Hán'
              : 'Hoàn thành bài học'}
          </button>
          {isVocabLesson && (
            <button
              onClick={() => router.push(`/${locale}/vocabulary`)}
              className="btn-secondary"
              style={{ marginTop: '8px' }}
            >
              ← Quay lại Danh sách Từ vựng
            </button>
          )}
          {isGrammarLesson && (
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="btn-secondary"
              style={{ marginTop: '8px' }}
            >
              ← Quay lại Lộ trình Ngữ pháp
            </button>
          )}
          {isKanjiLesson && (
            <button
              onClick={() => router.push(`/${locale}/kanji`)}
              className="btn-secondary"
              style={{ marginTop: '8px' }}
            >
              ← Quay lại Danh sách Chữ Hán
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
