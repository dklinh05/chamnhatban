'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth-context';
import { useParams, useRouter } from 'next/navigation';

type Lesson = {
  id: string;
  slug: string;
  titleVi: string;
  order: number;
};

type ProgressData = {
  completedLessonIds: string[];
};

type KanaDetail = {
  char: string;
  romaji: string;
  noteVi: string;
  noteEn: string;
  example: string;
  lessonSlug: string;
};

const KANA_DETAILS: Record<string, KanaDetail> = {
  ア: {
    char: 'ア',
    romaji: 'a',
    noteVi: 'Phát âm tương tự chữ "a" trong tiếng Việt.',
    noteEn: 'Pronounced like "a" in "father".',
    example: 'アメリカ (amerika - nước Mỹ / America)',
    lessonSlug: 'katakana-a',
  },
  イ: {
    char: 'イ',
    romaji: 'i',
    noteVi: 'Phát âm tương tự chữ "i" trong tiếng Việt.',
    noteEn: 'Pronounced like "ee" in "meet".',
    example: 'イギリス (igirisu - nước Anh / Britain)',
    lessonSlug: 'katakana-a',
  },
  ウ: {
    char: 'ウ',
    romaji: 'u',
    noteVi: 'Phát âm nhẹ, môi hơi khép (nửa u nửa ư).',
    noteEn: 'Pronounced like "oo" in "boot" with unrounded lips.',
    example: 'ウイスキー (uisukii - rượu whisky)',
    lessonSlug: 'katakana-a',
  },
  エ: {
    char: 'エ',
    romaji: 'e',
    noteVi: 'Phát âm tương tự chữ "ê" hoặc "e" trong tiếng Việt.',
    noteEn: 'Pronounced like "e" in "met".',
    example: 'エアコン (eakon - máy điều hòa / air conditioner)',
    lessonSlug: 'katakana-a',
  },
  オ: {
    char: 'オ',
    romaji: 'o',
    noteVi: 'Phát âm tương tự chữ "ô" trong tiếng Việt.',
    noteEn: 'Pronounced like "o" in "boat".',
    example: 'オレンジ (orenji - quả cam / orange)',
    lessonSlug: 'katakana-a',
  },

  カ: {
    char: 'カ',
    romaji: 'ka',
    noteVi: 'Phát âm tương tự "ca" trong tiếng Việt.',
    noteEn: 'Pronounced like "ca" in "car".',
    example: 'カメラ (kamera - máy ảnh / camera)',
    lessonSlug: 'katakana-ka',
  },
  キ: {
    char: 'キ',
    romaji: 'ki',
    noteVi: 'Phát âm tương tự "ki" trong tiếng Việt.',
    noteEn: 'Pronounced like "ke" in "key".',
    example: 'キー (kii - chìa khóa / key)',
    lessonSlug: 'katakana-ka',
  },
  ク: {
    char: 'ク',
    romaji: 'ku',
    noteVi: 'Phát âm tương tự "cu/cư" trong tiếng Việt.',
    noteEn: 'Pronounced like "coo" in "coop".',
    example: 'クラス (kurasu - lớp học / class)',
    lessonSlug: 'katakana-ka',
  },
  ケ: {
    char: 'ケ',
    romaji: 'ke',
    noteVi: 'Phát âm tương tự "kê" trong tiếng Việt.',
    noteEn: 'Pronounced like "ke" in "kept".',
    example: 'ケーキ (keeki - bánh ngọt / cake)',
    lessonSlug: 'katakana-ka',
  },
  コ: {
    char: 'コ',
    romaji: 'ko',
    noteVi: 'Phát âm tương tự "cô" trong tiếng Việt.',
    noteEn: 'Pronounced like "co" in "coat".',
    example: 'コップ (koppu - cái cốc / cup)',
    lessonSlug: 'katakana-ka',
  },

  サ: {
    char: 'サ',
    romaji: 'sa',
    noteVi: 'Phát âm tương tự "xa" trong tiếng Việt.',
    noteEn: 'Pronounced like "sa" in "sad".',
    example: 'サラダ (sarada - sa lát / salad)',
    lessonSlug: 'katakana-sa',
  },
  シ: {
    char: 'シ',
    romaji: 'shi',
    noteVi: 'Phát âm cong lưỡi tương tự "she" tiếng Anh.',
    noteEn: 'Pronounced like "she" in English.',
    example: 'シャツ (shatsu - áo sơ mi / shirt)',
    lessonSlug: 'katakana-sa',
  },
  ス: {
    char: 'ス',
    romaji: 'su',
    noteVi: 'Phát âm nhẹ tương tự "xư" hoặc "soo".',
    noteEn: 'Pronounced like "su" in "suit".',
    example: 'スプーン (supuun - cái thìa / spoon)',
    lessonSlug: 'katakana-sa',
  },
  セ: {
    char: 'セ',
    romaji: 'se',
    noteVi: 'Phát âm tương tự "xê" trong tiếng Việt.',
    noteEn: 'Pronounced like "se" in "set".',
    example: 'セーター (seetaa - áo len / sweater)',
    lessonSlug: 'katakana-sa',
  },
  ソ: {
    char: 'ソ',
    romaji: 'so',
    noteVi: 'Phát âm tương tự "xô" trong tiếng Việt.',
    noteEn: 'Pronounced like "so" in "soul".',
    example: 'ソファ (sofa - ghế sofa)',
    lessonSlug: 'katakana-sa',
  },

  タ: {
    char: 'タ',
    romaji: 'ta',
    noteVi: 'Phát âm nhẹ giống như "ta" lai với "tha".',
    noteEn: 'Pronounced like "ta" in "target".',
    example: 'タクシー (takushii - xe taxi)',
    lessonSlug: 'katakana-ta',
  },
  チ: {
    char: 'チ',
    romaji: 'chi',
    noteVi: 'Phát âm giống "chi" trong tiếng Việt.',
    noteEn: 'Pronounced like "chee" in "cheese".',
    example: 'チーズ (chiizu - phô mai / cheese)',
    lessonSlug: 'katakana-ta',
  },
  ツ: {
    char: 'ツ',
    romaji: 'tsu',
    noteVi: 'Phát âm gió bằng cách khép răng và bật hơi.',
    noteEn: 'Pronounced like "ts" in "cats" combined with "oo".',
    example: 'ツアー (tsuaa - chuyến du lịch / tour)',
    lessonSlug: 'katakana-ta',
  },
  テ: {
    char: 'テ',
    romaji: 'te',
    noteVi: 'Phát âm giống "tê" trong tiếng Việt.',
    noteEn: 'Pronounced like "te" in "tell".',
    example: 'テスト (tesuto - bài kiểm tra / test)',
    lessonSlug: 'katakana-ta',
  },
  ト: {
    char: 'ト',
    romaji: 'to',
    noteVi: 'Phát âm giống "tô" trong tiếng Việt.',
    noteEn: 'Pronounced like "to" in "toe".',
    example: 'トイレ (toire - nhà vệ sinh / toilet)',
    lessonSlug: 'katakana-ta',
  },

  ナ: {
    char: 'ナ',
    romaji: 'na',
    noteVi: 'Phát âm giống "na" trong tiếng Việt.',
    noteEn: 'Pronounced like "na" in "not".',
    example: 'ナイフ (naifu - con dao / knife)',
    lessonSlug: 'katakana-na',
  },
  ニ: {
    char: 'ニ',
    romaji: 'ni',
    noteVi: 'Phát âm giống "ni" trong tiếng Việt.',
    noteEn: 'Pronounced like "nee" in "need".',
    example: 'ニュース (nyuusu - tin tức / news)',
    lessonSlug: 'katakana-na',
  },
  ヌ: {
    char: 'ヌ',
    romaji: 'nu',
    noteVi: 'Phát âm giống "nu" trong tiếng Việt.',
    noteEn: 'Pronounced like "new" in "newt".',
    example: 'ヌードル (nuudoru - mì sợi / noodles)',
    lessonSlug: 'katakana-na',
  },
  ネ: {
    char: 'ネ',
    romaji: 'ne',
    noteVi: 'Phát âm giống "nê" trong tiếng Việt.',
    noteEn: 'Pronounced like "ne" in "nest".',
    example: 'ネクタイ (nekutai - cà vạt / necktie)',
    lessonSlug: 'katakana-na',
  },
  ノ: {
    char: 'ノ',
    romaji: 'no',
    noteVi: 'Phát âm giống "nô" trong tiếng Việt.',
    noteEn: 'Pronounced like "no" in "note".',
    example: 'ノート (nooto - cuốn vở / notebook)',
    lessonSlug: 'katakana-na',
  },

  ハ: {
    char: 'ハ',
    romaji: 'ha',
    noteVi: 'Phát âm giống "ha" trong tiếng Việt.',
    noteEn: 'Pronounced like "ha" in "hot".',
    example: 'ハム (hamu - thịt nguội / ham)',
    lessonSlug: 'katakana-ha',
  },
  ヒ: {
    char: 'ヒ',
    romaji: 'hi',
    noteVi: 'Phát âm giống "hi" trong tiếng Việt.',
    noteEn: 'Pronounced like "he" in "here".',
    example: 'ヒーター (hiitaa - lò sưởi / heater)',
    lessonSlug: 'katakana-ha',
  },
  フ: {
    char: 'フ',
    romaji: 'fu',
    noteVi: 'Phát âm thổi hơi nhẹ giữa fu và hu.',
    noteEn: 'Pronounced by blowing air between lips.',
    example: 'フランス (furansu - nước Pháp / France)',
    lessonSlug: 'katakana-ha',
  },
  ヘ: {
    char: 'ヘ',
    romaji: 'he',
    noteVi: 'Phát âm giống "hê" trong tiếng Việt.',
    noteEn: 'Pronounced like "he" in "help".',
    example: 'ヘリコプター (herikoputaa - máy bay trực thăng / helicopter)',
    lessonSlug: 'katakana-ha',
  },
  ホ: {
    char: 'ホ',
    romaji: 'ho',
    noteVi: 'Phát âm giống "hô" trong tiếng Việt.',
    noteEn: 'Pronounced like "ho" in "home".',
    example: 'ホテル (hoteru - khách sạn / hotel)',
    lessonSlug: 'katakana-ha',
  },

  マ: {
    char: 'マ',
    romaji: 'ma',
    noteVi: 'Phát âm giống "ma" trong tiếng Việt.',
    noteEn: 'Pronounced like "ma" in "mama".',
    example: 'マッチ (macchi - diêm / match)',
    lessonSlug: 'katakana-ma',
  },
  ミ: {
    char: 'ミ',
    romaji: 'mi',
    noteVi: 'Phát âm giống "mi" trong tiếng Việt.',
    noteEn: 'Pronounced like "me" in "meet".',
    example: 'ミルク (miruku - sữa / milk)',
    lessonSlug: 'katakana-ma',
  },
  ム: {
    char: 'ム',
    romaji: 'mu',
    noteVi: 'Phát âm giống "mu" trong tiếng Việt.',
    noteEn: 'Pronounced like "moo" in "mood".',
    example: 'ムービー (muubii - phim / movie)',
    lessonSlug: 'katakana-ma',
  },
  メ: {
    char: 'メ',
    romaji: 'me',
    noteVi: 'Phát âm giống "mê" trong tiếng Việt.',
    noteEn: 'Pronounced like "me" in "met".',
    example: 'メール (meeru - thư điện tử / email)',
    lessonSlug: 'katakana-ma',
  },
  モ: {
    char: 'モ',
    romaji: 'mo',
    noteVi: 'Phát âm giống "mô" trong tiếng Việt.',
    noteEn: 'Pronounced like "mo" in "more".',
    example: 'モニター (monitaa - màn hình / monitor)',
    lessonSlug: 'katakana-ma',
  },

  ヤ: {
    char: 'ヤ',
    romaji: 'ya',
    noteVi: 'Phát âm giống "ya" trong tiếng Việt.',
    noteEn: 'Pronounced like "ya" in "yard".',
    example: 'ヤクルト (yakuruto - sữa chua Yakult)',
    lessonSlug: 'katakana-ya',
  },
  ユ: {
    char: 'ユ',
    romaji: 'yu',
    noteVi: 'Phát âm giống "yu" trong tiếng Việt.',
    noteEn: 'Pronounced like "you" in English.',
    example: 'ユニフォーム (yunifoomu - đồng phục / uniform)',
    lessonSlug: 'katakana-ya',
  },
  ヨ: {
    char: 'ヨ',
    romaji: 'yo',
    noteVi: 'Phát âm giống "yô" trong tiếng Việt.',
    noteEn: 'Pronounced like "yo" in "yoyo".',
    example: 'ヨーグルト (yooguruto - sữa chua / yogurt)',
    lessonSlug: 'katakana-ya',
  },

  ラ: {
    char: 'ラ',
    romaji: 'ra',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between light L and R.',
    example: 'ラジオ (rajio - máy radio)',
    lessonSlug: 'katakana-ra',
  },
  リ: {
    char: 'リ',
    romaji: 'ri',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between lee and ree.',
    example: 'リボン (ribon - ruy băng / ribbon)',
    lessonSlug: 'katakana-ra',
  },
  ル: {
    char: 'ル',
    romaji: 'ru',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between loo and roo.',
    example: 'ルール (ruuru - quy tắc / rule)',
    lessonSlug: 'katakana-ra',
  },
  レ: {
    char: 'レ',
    romaji: 're',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between lay and ray.',
    example: 'レストラン (resutoran - nhà hàng / restaurant)',
    lessonSlug: 'katakana-ra',
  },
  ロ: {
    char: 'ロ',
    romaji: 'ro',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between low and row.',
    example: 'ロボット (robotto - người máy / robot)',
    lessonSlug: 'katakana-ra',
  },

  ワ: {
    char: 'ワ',
    romaji: 'wa',
    noteVi: 'Phát âm tương tự "wa" tiếng Anh.',
    noteEn: 'Pronounced like "wa" in "water".',
    example: 'ワイン (wain - rượu vang / wine)',
    lessonSlug: 'katakana-wa',
  },
  ヲ: {
    char: 'ヲ',
    romaji: 'wo',
    noteVi: 'Thường phát âm giống "o", dùng làm trợ từ.',
    noteEn: 'Pronounced like "o", used as a particle.',
    example: 'ヲ (Thường dùng làm trợ từ trong văn cổ hoặc tên riêng)',
    lessonSlug: 'katakana-wa',
  },
  ン: {
    char: 'ン',
    romaji: 'n',
    noteVi: 'Âm mũi duy nhất, đứng ở cuối từ.',
    noteEn: 'Nasal sound, pronounced like "n" or "m".',
    example: 'パン (pan - bánh mì / bread)',
    lessonSlug: 'katakana-wa',
  },
};

const SEIKUON_GRID: (string | null)[] = [
  'ア',
  'イ',
  'ウ',
  'エ',
  'オ',
  'カ',
  'キ',
  'ク',
  'ケ',
  'コ',
  'サ',
  'シ',
  'ス',
  'セ',
  'ソ',
  'タ',
  'チ',
  'ツ',
  'テ',
  'ト',
  'ナ',
  'ニ',
  'ヌ',
  'ネ',
  'ノ',
  'ハ',
  'ヒ',
  'フ',
  'ヘ',
  'ホ',
  'マ',
  'ミ',
  'ム',
  'メ',
  'モ',
  'ヤ',
  null,
  'ユ',
  null,
  'ヨ',
  'ラ',
  'リ',
  'ル',
  'レ',
  'ロ',
  'ワ',
  null,
  null,
  null,
  'ヲ',
  'ン',
  null,
  null,
  null,
  null,
];

export default function KatakanaPage() {
  const { user, apiFetch, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [activeTab, setActiveTab] = useState<'seikuon' | 'dakuon' | 'yoon'>('seikuon');
  const [selectedChar, setSelectedChar] = useState<KanaDetail | null>(null);
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
            const lessonsData = await lessonsRes.json();
            const progressData = await progressRes.json();
            setLessons(lessonsData.filter((l: Lesson) => l.slug.startsWith('katakana-')));
            setProgress(progressData);
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
        <p>Đang tải bảng chữ cái...</p>
      </div>
    );
  }

  if (!user) return null;

  const isLessonCompleted = (lessonSlug: string): boolean => {
    const lesson = lessons.find((l) => l.slug === lessonSlug);
    if (!lesson || !progress) return false;
    return progress.completedLessonIds.includes(lesson.id);
  };

  const handleCardClick = (char: string) => {
    const detail = KANA_DETAILS[char];
    if (detail) {
      setSelectedChar(detail);
    }
  };

  const speakCharacter = (char: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="btn-secondary"
            style={{ marginRight: '12px' }}
          >
            ← Lộ trình
          </button>
          <h1>Bảng chữ cái Katakana</h1>
          <span className="badge">Bảng chữ Katakana</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="hiragana-container">
        <div className="hiragana-header">
          <h2>Học chữ cái Katakana</h2>
          <p className="section-desc">
            Bảng chữ cái tiếng Nhật biểu ý Katakana. Hãy nhấn vào từng chữ để nghe phát âm, xem chi
            tiết nét viết và luyện tập theo từng hàng.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="hiragana-tabs">
          <button
            onClick={() => setActiveTab('seikuon')}
            className={`tab-btn ${activeTab === 'seikuon' ? 'active' : ''}`}
          >
            Chữ Cơ Bản (Seikuon)
          </button>
          <button
            onClick={() => setActiveTab('dakuon')}
            className={`tab-btn ${activeTab === 'dakuon' ? 'active' : ''}`}
          >
            Âm Đục / Bán Đục (Dakuon)
          </button>
          <button
            onClick={() => setActiveTab('yoon')}
            className={`tab-btn ${activeTab === 'yoon' ? 'active' : ''}`}
          >
            Âm Ghép (Yoon)
          </button>
        </div>

        {/* Seikuon View */}
        {activeTab === 'seikuon' && (
          <div className="chart-grid">
            {SEIKUON_GRID.map((char, idx) => {
              if (!char) {
                return <div key={`empty-${idx}`} className="char-card empty" />;
              }

              const detail = KANA_DETAILS[char];
              const isCompleted = detail ? isLessonCompleted(detail.lessonSlug) : false;

              return (
                <div
                  key={char}
                  className={`char-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleCardClick(char)}
                >
                  <span className="char-ja">{char}</span>
                  <span className="char-romaji">{detail?.romaji}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Dakuon View */}
        {activeTab === 'dakuon' && (
          <div className="chart-grid">
            {[
              'ガ',
              'ギ',
              'グ',
              'ゲ',
              'ゴ',
              'ザ',
              'ジ',
              'ズ',
              'ゼ',
              'ゾ',
              'ダ',
              'ヂ',
              'ヅ',
              'デ',
              'ド',
              'バ',
              'ビ',
              'ブ',
              'ベ',
              'ボ',
              'パ',
              'ピ',
              'プ',
              'ペ',
              'ポ',
            ].map((char) => {
              const baseLessonMap: { [key: string]: string } = {
                ガ: 'katakana-ka',
                ギ: 'katakana-ka',
                グ: 'katakana-ka',
                ゲ: 'katakana-ka',
                ゴ: 'katakana-ka',
                ザ: 'katakana-sa',
                ジ: 'katakana-sa',
                ズ: 'katakana-sa',
                ゼ: 'katakana-sa',
                ゾ: 'katakana-sa',
                ダ: 'katakana-ta',
                ヂ: 'katakana-ta',
                ヅ: 'katakana-ta',
                デ: 'katakana-ta',
                ド: 'katakana-ta',
                バ: 'katakana-ha',
                ビ: 'katakana-ha',
                ブ: 'katakana-ha',
                ベ: 'katakana-ha',
                ボ: 'katakana-ha',
                パ: 'katakana-ha',
                ピ: 'katakana-ha',
                プ: 'katakana-ha',
                ペ: 'katakana-ha',
                ポ: 'katakana-ha',
              };
              const isCompleted = isLessonCompleted(baseLessonMap[char] || '');
              const romajiMap: { [key: string]: string } = {
                ガ: 'ga',
                ギ: 'gi',
                グ: 'gu',
                ゲ: 'ge',
                ゴ: 'go',
                ザ: 'za',
                ジ: 'ji',
                ズ: 'zu',
                ゼ: 'ze',
                ゾ: 'zo',
                ダ: 'da',
                ヂ: 'ji',
                ヅ: 'zu',
                デ: 'de',
                ド: 'do',
                バ: 'ba',
                ビ: 'bi',
                ブ: 'bu',
                ベ: 'be',
                ボ: 'bo',
                パ: 'pa',
                ピ: 'pi',
                プ: 'pu',
                ペ: 'pe',
                ポ: 'po',
              };

              return (
                <div
                  key={char}
                  className={`char-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    setSelectedChar({
                      char,
                      romaji: romajiMap[char] || char,
                      noteVi: 'Âm đục/bán đục phát âm tương ứng biến thể hàng chính.',
                      noteEn: 'Consonant mutation representing voiced sounds.',
                      example: '',
                      lessonSlug: baseLessonMap[char],
                    });
                  }}
                >
                  <span className="char-ja">{char}</span>
                  <span className="char-romaji">{romajiMap[char] || char}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Yoon View */}
        {activeTab === 'yoon' && (
          <div className="chart-grid">
            {[
              'キャ',
              'キュ',
              'キョ',
              'シャ',
              'シュ',
              'ショ',
              'チャ',
              'チュ',
              'チョ',
              'ニャ',
              'ニュ',
              'ニョ',
              'ヒャ',
              'ヒュ',
              'ヒョ',
              'ミャ',
              'ミュ',
              'ミョ',
              'リャ',
              'リュ',
              'リョ',
            ].map((char) => {
              const baseLessonMap: { [key: string]: string } = {
                キ: 'katakana-ka',
                シ: 'katakana-sa',
                チ: 'katakana-ta',
                ニ: 'katakana-na',
                ヒ: 'katakana-ha',
                ミ: 'katakana-ma',
                リ: 'katakana-ra',
              };
              const isCompleted = isLessonCompleted(baseLessonMap[char[0]] || '');
              const romajiMap: { [key: string]: string } = {
                キャ: 'kya',
                キュ: 'kyu',
                キョ: 'kyo',
                シャ: 'sha',
                シュ: 'shu',
                ショ: 'sho',
                チャ: 'cha',
                チュ: 'chu',
                チョ: 'cho',
                ニャ: 'nya',
                ニュ: 'nyu',
                ニョ: 'nyo',
                ヒャ: 'hya',
                ヒュ: 'hyu',
                ヒョ: 'hyo',
                ミャ: 'mya',
                ミュ: 'myu',
                ミョ: 'myo',
                リャ: 'rya',
                リュ: 'ryu',
                リョ: 'ryo',
              };

              return (
                <div
                  key={char}
                  className={`char-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    setSelectedChar({
                      char,
                      romaji: romajiMap[char] || char,
                      noteVi: 'Âm ghép được phát âm kết hợp liền mạch của 2 chữ.',
                      noteEn: 'Contracted Japanese digraph sounds.',
                      example: '',
                      lessonSlug: baseLessonMap[char[0]],
                    });
                  }}
                >
                  <span className="char-ja">{char}</span>
                  <span className="char-romaji">{romajiMap[char] || char}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Character Details Modal Overlay */}
      {selectedChar && (
        <div className="modal-overlay" onClick={() => setSelectedChar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedChar(null)}>
              ×
            </button>

            <div className="modal-header-detail">
              <span className="modal-ja">{selectedChar.char}</span>
              <span className="modal-romaji">{selectedChar.romaji}</span>
              <button
                onClick={() => speakCharacter(selectedChar.char)}
                className="btn-secondary"
                style={{
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '12px',
                }}
              >
                🔊 Phát âm (Audio)
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <span className="modal-section-title">Cách đọc &amp; phát âm:</span>
                <p className="modal-section-content">
                  {locale === 'vi' ? selectedChar.noteVi : selectedChar.noteEn}
                </p>
              </div>

              {selectedChar.example && (
                <div className="modal-section">
                  <span className="modal-section-title">Ví dụ sử dụng:</span>
                  <p
                    className="modal-section-content"
                    style={{ fontSize: '16px', fontWeight: '600' }}
                  >
                    {selectedChar.example}
                  </p>
                </div>
              )}

              <div className="modal-section">
                <span className="modal-section-title">Trạng thái hoàn thành:</span>
                <p className="modal-section-content">
                  {isLessonCompleted(selectedChar.lessonSlug) ? (
                    <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>
                      ✓ Đã hoàn thành hàng này
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-muted)' }}>Chưa học hàng này</span>
                  )}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  router.push(`/${locale}/lessons/${selectedChar.lessonSlug}`);
                }}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Học Hàng Này
              </button>
              <button
                onClick={() => {
                  router.push(`/${locale}/lessons/${selectedChar.lessonSlug}/practice`);
                }}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Luyện Tập Hàng Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
