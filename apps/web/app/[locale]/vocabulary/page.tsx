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

const THEME_EMOJI: Record<string, string> = {
  'vocab-greetings': '👋',
  'vocab-numbers': '🔢',
  'vocab-time': '🕐',
  'vocab-family': '👪',
  'vocab-body': '🧍',
  'vocab-food': '🍱',
  'vocab-transport': '🚃',
  'vocab-school': '📚',
  'vocab-colors': '🎨',
  'vocab-adjectives': '✨',
};

export default function VocabularyPage() {
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
            setLessons(all.filter((l: Lesson) => l.slug.startsWith('vocab-')));
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
        <p>Đang tải từ vựng...</p>
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
          <h1>Từ vựng N5</h1>
          <span className="badge">Vocabulary</span>
        </div>
      </header>

      <main className="hiragana-container">
        <div className="hiragana-header">
          <h2>Học Từ vựng tiếng Nhật N5</h2>
          <p className="section-desc">
            Bộ từ vựng N5 được phân theo chủ đề. Nhấn vào từng bộ để bắt đầu học. Tiến độ:{' '}
            <strong>
              {completedCount} / {lessons.length}
            </strong>{' '}
            chủ đề đã hoàn thành.
          </p>
        </div>

        <div className="vocab-hub-grid">
          {lessons.map((lesson) => {
            const done = isDone(lesson.id);
            const emoji = THEME_EMOJI[lesson.slug] ?? '📖';
            const title = locale === 'vi' ? lesson.titleVi : lesson.titleEn;
            const desc = locale === 'vi' ? lesson.descriptionVi : lesson.descriptionEn;

            return (
              <div
                key={lesson.id}
                id={`vocab-lesson-${lesson.slug}`}
                className={`vocab-hub-card ${done ? 'completed' : ''}`}
                onClick={() => router.push(`/${locale}/lessons/${lesson.slug}`)}
              >
                <div className="vocab-hub-emoji">{emoji}</div>
                <div className="vocab-hub-info">
                  <h3 className="vocab-hub-title">{title}</h3>
                  {desc && <p className="vocab-hub-desc">{desc}</p>}
                </div>
                <div className="vocab-hub-status">
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
