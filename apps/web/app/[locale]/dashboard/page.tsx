'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth-context';
import { useParams, useRouter } from 'next/navigation';

type Lesson = {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  titleJa: string;
  descriptionVi: string | null;
  descriptionEn: string | null;
  descriptionJa: string | null;
  order: number;
};

type ProgressData = {
  completedLessonIds: string[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
};

export default function DashboardPage() {
  const { user, apiFetch, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [lessonsRes, progressRes, statsRes] = await Promise.all([
            apiFetch('/content/lessons'),
            apiFetch('/progress'),
            apiFetch('/flashcards/stats').catch(() => null),
          ]);

          if (lessonsRes.ok && progressRes.ok) {
            const lessonsData = await lessonsRes.json();
            const progressData = await progressRes.json();
            setLessons(lessonsData);
            setProgress(progressData);
          }

          if (statsRes && statsRes.ok) {
            const statsData = await statsRes.json();
            setDueCount(statsData.dueCount || 0);
          }
        } catch (e) {
          console.error('Failed to fetch dashboard data', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/login`);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải lộ trình học...</p>
      </div>
    );
  }

  if (!user) return null;

  const hiraganaLessons = lessons.filter((l) => l.slug.startsWith('hiragana-'));
  const completedHiraganaCount = hiraganaLessons.filter((l) =>
    progress?.completedLessonIds.includes(l.id)
  ).length;

  const katakanaLessons = lessons.filter((l) => l.slug.startsWith('katakana-'));
  const completedKatakanaCount = katakanaLessons.filter((l) =>
    progress?.completedLessonIds.includes(l.id)
  ).length;

  const vocabLessons = lessons.filter((l) => l.slug.startsWith('vocab-'));
  const completedVocabCount = vocabLessons.filter((l) =>
    progress?.completedLessonIds.includes(l.id)
  ).length;

  const grammarLessons = lessons.filter((l) => l.slug.startsWith('grammar-'));
  const completedGrammarCount = grammarLessons.filter((l) =>
    progress?.completedLessonIds.includes(l.id)
  ).length;

  const kanjiLessons = lessons.filter((l) => l.slug.startsWith('kanji-'));
  const completedKanjiCount = kanjiLessons.filter((l) =>
    progress?.completedLessonIds.includes(l.id)
  ).length;

  return (
    <div className="dashboard-layout">
      {/* Header / Nav */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>Chạm Nhật Bản</h1>
          <span className="badge">N5 Nền tảng</span>
        </div>
        <div className="header-user">
          <span className="username">Chào, {user.displayName || user.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Streak & Stats Section */}
        <section className="stats-section">
          <div className="stat-card streak-card">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <h3>{progress?.currentStreak ?? 0} Ngày</h3>
              <p>Chuỗi học liên tiếp (Streak)</p>
            </div>
            {progress && progress.currentStreak > 0 ? (
              <span className="streak-active-msg">Tuyệt vời! Hãy giữ vững phong độ!</span>
            ) : (
              <span className="streak-inactive-msg">Học ngay một bài học để kích hoạt streak!</span>
            )}
          </div>

          <div className="stat-card record-card">
            <div className="record-icon">🏆</div>
            <div className="record-info">
              <h3>{progress?.longestStreak ?? 0} Ngày</h3>
              <p>Kỷ lục streak dài nhất</p>
            </div>
          </div>
        </section>

        {/* Flashcards SRS Due Alert */}
        {dueCount > 0 && (
          <section className="stats-section" style={{ marginTop: '0', marginBottom: '24px' }}>
            <div
              className="stat-card streak-card"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                cursor: 'pointer',
                gap: '16px'
              }}
              onClick={() => router.push(`/${locale}/flashcards/review`)}
              id="flashcards-due-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '32px' }}>💮</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--color-text)' }}>
                    Ôn tập hàng ngày (SRS)
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-muted)' }}>
                    Bạn có <strong style={{ color: '#a855f7' }}>{dueCount}</strong> thẻ cần ôn tập hôm nay để duy trì trí nhớ.
                  </p>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{
                  background: '#a855f7',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                Ôn tập ngay →
              </button>
            </div>
          </section>
        )}

        {/* Hiragana & Katakana Cards */}
        <section className="learning-path-section">
          <h2>Bảng chữ cái</h2>
          <p className="section-desc">
            Bắt đầu hành trình học tiếng Nhật bằng cách làm quen với bảng chữ cái Hiragana và
            Katakana.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div
              className={`lesson-path-card ${
                completedHiraganaCount === 10 ? 'completed' : 'pending'
              }`}
              onClick={() => router.push(`/${locale}/hiragana`)}
              style={{ borderLeft: '4px solid var(--color-accent)' }}
            >
              <div className="lesson-number">🇯🇵</div>
              <div className="lesson-details">
                <h3>Bảng chữ cái Hiragana (Gojuon)</h3>
                <p>Học phát âm, nét viết và luyện tập nhận diện 46 chữ cái Hiragana cơ bản.</p>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--color-accent-hover)',
                    fontWeight: '600',
                  }}
                >
                  Tiến độ: {completedHiraganaCount} / 10 hàng chữ cái đã hoàn thành
                </div>
              </div>
              <div className="lesson-status">
                <span
                  className="status-badge pending-badge"
                  style={{ borderColor: 'var(--color-accent)' }}
                >
                  Xem bảng chữ
                </span>
              </div>
            </div>

            <div
              className={`lesson-path-card ${
                completedKatakanaCount === 10 ? 'completed' : 'pending'
              }`}
              onClick={() => router.push(`/${locale}/katakana`)}
              style={{ borderLeft: '4px solid var(--color-accent)' }}
            >
              <div className="lesson-number">🇯🇵</div>
              <div className="lesson-details">
                <h3>Bảng chữ cái Katakana (Katakana Chart)</h3>
                <p>
                  Học cách đọc, viết và thực hành bảng chữ cái Katakana dùng cho các từ mượn tiếng
                  nước ngoài.
                </p>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--color-accent-hover)',
                    fontWeight: '600',
                  }}
                >
                  Tiến độ: {completedKatakanaCount} / 10 hàng chữ cái đã hoàn thành
                </div>
              </div>
              <div className="lesson-status">
                <span
                  className="status-badge pending-badge"
                  style={{ borderColor: 'var(--color-accent)' }}
                >
                  Xem bảng chữ
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Vocabulary N5 Section */}
        <section className="learning-path-section">
          <h2>Từ vựng N5</h2>
          <p className="section-desc">
            Học bộ từ vựng N5 được phân theo 10 chủ đề thực tế.
          </p>
          <div
            id="vocab-hub-link"
            className={`lesson-path-card ${completedVocabCount === 10 ? 'completed' : 'pending'}`}
            onClick={() => router.push(`/${locale}/vocabulary`)}
            style={{ borderLeft: '4px solid var(--color-success)' }}
          >
            <div className="lesson-number">📖</div>
            <div className="lesson-details">
              <h3>Từ vựng N5 — 10 Chủ đề</h3>
              <p>Chào hỏi, Số đếm, Thời gian, Gia đình, Cơ thể, Đồ ăn, Giao thông, Trường học, Màu sắc, Tính từ.</p>
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: 'var(--color-success)',
                  fontWeight: '600',
                }}
              >
                Tiến độ: {completedVocabCount} / {vocabLessons.length} chủ đề đã hoàn thành
              </div>
            </div>
            <div className="lesson-status">
              {completedVocabCount === vocabLessons.length && vocabLessons.length > 0 ? (
                <span className="status-badge completed-badge">✓ Hoàn thành</span>
              ) : (
                <span
                  className="status-badge pending-badge"
                  style={{ borderColor: 'var(--color-success)' }}
                >
                  Học từ vựng
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Kanji N5 Section */}
        <section className="learning-path-section">
          <h2>Chữ Hán N5</h2>
          <p className="section-desc">
            Học 36 chữ Hán N5 cơ bản được phân theo 5 chủ đề.
          </p>
          <div
            id="kanji-hub-link"
            className={`lesson-path-card ${completedKanjiCount === 5 ? 'completed' : 'pending'}`}
            onClick={() => router.push(`/${locale}/kanji`)}
            style={{ borderLeft: '4px solid #a855f7' }}
          >
            <div className="lesson-number">💮</div>
            <div className="lesson-details">
              <h3>Chữ Hán N5 — 5 Chủ đề</h3>
              <p>Số đếm, Tự nhiên &amp; Thời gian, Phương hướng, Con người, Động từ cơ bản.</p>
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: '#a855f7',
                  fontWeight: '600',
                }}
              >
                Tiến độ: {completedKanjiCount} / {kanjiLessons.length} bài học đã hoàn thành
              </div>
            </div>
            <div className="lesson-status">
              {completedKanjiCount === kanjiLessons.length && kanjiLessons.length > 0 ? (
                <span className="status-badge completed-badge">✓ Hoàn thành</span>
              ) : (
                <span
                  className="status-badge pending-badge"
                  style={{ borderColor: '#a855f7' }}
                >
                  Học chữ Hán
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Learning Path (Lessons list) */}
        <section className="learning-path-section">
          <h2>Ngữ pháp N5</h2>
          <p className="section-desc">
            Hoàn thành các bài học ngữ pháp dưới đây để xây dựng nền tảng câu tiếng Nhật N5.
            Tiến độ: <strong>{completedGrammarCount} / {grammarLessons.length}</strong> bài học đã hoàn thành.
          </p>

          {grammarLessons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <p>
                Hiện chưa có bài học ngữ pháp nào được xuất bản. Admin sẽ sớm cập nhật bài
                học mới!
              </p>
            </div>
          ) : (
            <div className="learning-path-list">
              {grammarLessons.map((lesson, idx) => {
                const isCompleted = progress?.completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-path-card ${isCompleted ? 'completed' : 'pending'}`}
                    onClick={() => router.push(`/${locale}/lessons/${lesson.slug}`)}
                  >
                    <div className="lesson-number">#{idx + 1}</div>
                    <div className="lesson-details">
                      <h3>
                        {locale === 'vi'
                          ? lesson.titleVi
                          : locale === 'ja'
                          ? lesson.titleJa
                          : lesson.titleEn}
                      </h3>
                      <p>
                        {locale === 'vi'
                          ? lesson.descriptionVi
                          : locale === 'ja'
                          ? lesson.descriptionJa
                          : lesson.descriptionEn || 'Không có mô tả.'}
                      </p>
                    </div>
                    <div className="lesson-status">
                      {isCompleted ? (
                        <span className="status-badge completed-badge">✓ Đã học</span>
                      ) : (
                        <span className="status-badge pending-badge">Bắt đầu học</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
