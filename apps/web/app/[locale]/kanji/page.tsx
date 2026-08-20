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
  order: number;
};

type ProgressData = {
  completedLessonIds: string[];
};

const KANJI_THEME_EMOJI: Record<string, string> = {
  'kanji-numbers': '🔢',
  'kanji-nature': '🌲',
  'kanji-directions': '🗺️',
  'kanji-people': '👥',
  'kanji-verbs': '🏃',
};

export default function KanjiPage() {
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isAuthLoading, locale, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [lessonsRes, progressRes] = await Promise.all([
            apiFetch('/content/lessons'),
            apiFetch('/progress'),
          ]);
          if (lessonsRes.ok && progressRes.ok) {
            const all = await lessonsRes.json();
            const prog = await progressRes.json();
            setLessons(all.filter((l: Lesson) => l.slug.startsWith('kanji-')));
            setProgress(prog);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách chữ Hán...</p>
      </div>
    );
  }

  if (!user) return null;

  const isDone = (id: string) => progress?.completedLessonIds.includes(id) ?? false;
  const completedCount = lessons.filter((l) => isDone(l.id)).length;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-brand">
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="btn-secondary"
            style={{ marginRight: '12px' }}
          >
            {'← Lộ trình'}
          </button>
          <h1>Chữ Hán N5</h1>
          <span className="badge">Kanji</span>
        </div>
      </header>

      <main className="hiragana-container">
        <div className="hiragana-header">
          <h2>Học Chữ Hán (Kanji) tiếng Nhật N5</h2>
          <p className="section-desc">
            Nhận diện mặt chữ, âm đọc Onyomi/Kunyomi và ý nghĩa của 36 chữ Hán cơ bản nhất trong N5.
            Tiến độ:{' '}
            <strong>
              {completedCount} / {lessons.length}
            </strong>{' '}
            bài học đã hoàn thành.
          </p>
        </div>

        <div className="kanji-hub-grid">
          {lessons.map((lesson) => {
            const done = isDone(lesson.id);
            const emoji = KANJI_THEME_EMOJI[lesson.slug] ?? '💮';
            const title = locale === 'vi' ? lesson.titleVi : lesson.titleEn;
            const desc = locale === 'vi' ? lesson.descriptionVi : lesson.descriptionEn;

            return (
              <div
                key={lesson.id}
                id={`kanji-lesson-${lesson.slug}`}
                className={`kanji-hub-card ${done ? 'completed' : ''}`}
                onClick={() => router.push(`/${locale}/lessons/${lesson.slug}`)}
              >
                <div className="kanji-hub-emoji">{emoji}</div>
                <div className="kanji-hub-info">
                  <h3 className="kanji-hub-title">{title}</h3>
                  {desc && <p className="kanji-hub-desc">{desc}</p>}
                </div>
                <div className="kanji-hub-status">
                  {done ? (
                    <span className="status-badge completed-badge">✓ Đã học</span>
                  ) : (
                    <span className="status-badge pending-badge">Bắt đầu học</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
