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
  あ: {
    char: 'あ',
    romaji: 'a',
    noteVi: 'Phát âm tương tự chữ "a" trong tiếng Việt.',
    noteEn: 'Pronounced like "a" in "father".',
    example: 'あさ (asa - buổi sáng / morning)',
    lessonSlug: 'hiragana-a',
  },
  い: {
    char: 'い',
    romaji: 'i',
    noteVi: 'Phát âm tương tự chữ "i" trong tiếng Việt.',
    noteEn: 'Pronounced like "ee" in "meet".',
    example: 'いぬ (inu - con chó / dog)',
    lessonSlug: 'hiragana-a',
  },
  う: {
    char: 'う',
    romaji: 'u',
    noteVi: 'Phát âm nhẹ, môi hơi khép (nửa u nửa ư).',
    noteEn: 'Pronounced like "oo" in "boot" with unrounded lips.',
    example: 'うみ (umi - biển / sea)',
    lessonSlug: 'hiragana-a',
  },
  え: {
    char: 'え',
    romaji: 'e',
    noteVi: 'Phát âm tương tự chữ "ê" hoặc "e" trong tiếng Việt.',
    noteEn: 'Pronounced like "e" in "met".',
    example: 'えんぴつ (enpitsu - bút chì / pencil)',
    lessonSlug: 'hiragana-a',
  },
  お: {
    char: 'お',
    romaji: 'o',
    noteVi: 'Phát âm tương tự chữ "ô" trong tiếng Việt.',
    noteEn: 'Pronounced like "o" in "boat".',
    example: 'おちゃ (ocha - trà xanh / green tea)',
    lessonSlug: 'hiragana-a',
  },

  か: {
    char: 'か',
    romaji: 'ka',
    noteVi: 'Phát âm tương tự "ca" trong tiếng Việt.',
    noteEn: 'Pronounced like "ca" in "car".',
    example: 'かさ (kasa - cái ô / umbrella)',
    lessonSlug: 'hiragana-ka',
  },
  き: {
    char: 'き',
    romaji: 'ki',
    noteVi: 'Phát âm tương tự "ki" trong tiếng Việt.',
    noteEn: 'Pronounced like "ke" in "key".',
    example: 'きもの (kimono - áo Kimono)',
    lessonSlug: 'hiragana-ka',
  },
  く: {
    char: 'く',
    romaji: 'ku',
    noteVi: 'Phát âm tương tự "cu/cư" trong tiếng Việt.',
    noteEn: 'Pronounced like "coo" in "coop".',
    example: 'くも (kumo - đám mây / cloud)',
    lessonSlug: 'hiragana-ka',
  },
  け: {
    char: 'け',
    romaji: 'ke',
    noteVi: 'Phát âm tương tự "kê" trong tiếng Việt.',
    noteEn: 'Pronounced like "ke" in "kept".',
    example: 'けむり (kemuri - khói / smoke)',
    lessonSlug: 'hiragana-ka',
  },
  こ: {
    char: 'こ',
    romaji: 'ko',
    noteVi: 'Phát âm tương tự "cô" trong tiếng Việt.',
    noteEn: 'Pronounced like "co" in "coat".',
    example: 'こころ (kokoro - trái tim / heart)',
    lessonSlug: 'hiragana-ka',
  },

  さ: {
    char: 'さ',
    romaji: 'sa',
    noteVi: 'Phát âm tương tự "xa" trong tiếng Việt.',
    noteEn: 'Pronounced like "sa" in "sad".',
    example: 'sakura (さくら - hoa anh đào)',
    lessonSlug: 'hiragana-sa',
  },
  し: {
    char: 'し',
    romaji: 'shi',
    noteVi: 'Phát âm cong lưỡi tương tự "she" tiếng Anh.',
    noteEn: 'Pronounced like "she" in English.',
    example: 'しお (shio - muối / salt)',
    lessonSlug: 'hiragana-sa',
  },
  す: {
    char: 'す',
    romaji: 'su',
    noteVi: 'Phát âm nhẹ tương tự "xư" hoặc "soo".',
    noteEn: 'Pronounced like "su" in "suit".',
    example: 'すし (sushi - món sushi)',
    lessonSlug: 'hiragana-sa',
  },
  せ: {
    char: 'せ',
    romaji: 'se',
    noteVi: 'Phát âm tương tự "xê" trong tiếng Việt.',
    noteEn: 'Pronounced like "se" in "set".',
    example: 'せんせい (sensei - giáo viên / teacher)',
    lessonSlug: 'hiragana-sa',
  },
  そ: {
    char: 'そ',
    romaji: 'so',
    noteVi: 'Phát âm tương tự "xô" trong tiếng Việt.',
    noteEn: 'Pronounced like "so" in "soul".',
    example: 'そら (sora - bầu trời / sky)',
    lessonSlug: 'hiragana-sa',
  },

  た: {
    char: 'た',
    romaji: 'ta',
    noteVi: 'Phát âm nhẹ giống như "ta" lai với "tha".',
    noteEn: 'Pronounced like "ta" in "target".',
    example: 'たまご (tamago - trứng / egg)',
    lessonSlug: 'hiragana-ta',
  },
  ち: {
    char: 'ち',
    romaji: 'chi',
    noteVi: 'Phát âm giống "chi" trong tiếng Việt.',
    noteEn: 'Pronounced like "chee" in "cheese".',
    example: 'ちず (chizu - bản đồ / map)',
    lessonSlug: 'hiragana-ta',
  },
  つ: {
    char: 'つ',
    romaji: 'tsu',
    noteVi: 'Phát âm gió bằng cách khép răng và bật hơi.',
    noteEn: 'Pronounced like "ts" in "cats" combined with "oo".',
    example: 'つくえ (tsukue - cái bàn / desk)',
    lessonSlug: 'hiragana-ta',
  },
  て: {
    char: 'て',
    romaji: 'te',
    noteVi: 'Phát âm giống "tê" trong tiếng Việt.',
    noteEn: 'Pronounced like "te" in "tell".',
    example: 'てがみ (tegami - bức thư / letter)',
    lessonSlug: 'hiragana-ta',
  },
  と: {
    char: 'と',
    romaji: 'to',
    noteVi: 'Phát âm giống "tô" trong tiếng Việt.',
    noteEn: 'Pronounced like "to" in "toe".',
    example: 'ともだち (tomodachi - bạn bè / friend)',
    lessonSlug: 'hiragana-ta',
  },

  な: {
    char: 'な',
    romaji: 'na',
    noteVi: 'Phát âm giống "na" trong tiếng Việt.',
    noteEn: 'Pronounced like "na" in "not".',
    example: 'なつ (natsu - mùa hè / summer)',
    lessonSlug: 'hiragana-na',
  },
  に: {
    char: 'に',
    romaji: 'ni',
    noteVi: 'Phát âm giống "ni" trong tiếng Việt.',
    noteEn: 'Pronounced like "nee" in "need".',
    example: 'niku (にく - thịt / meat)',
    lessonSlug: 'hiragana-na',
  },
  nu: {
    char: 'ぬ',
    romaji: 'nu',
    noteVi: 'Phát âm giống "nu" trong tiếng Việt.',
    noteEn: 'Pronounced like "new" in "newt".',
    example: 'いぬ (inu - con chó / dog)',
    lessonSlug: 'hiragana-na',
  },
  ne: {
    char: 'ね',
    romaji: 'ne',
    noteVi: 'Phát âm giống "nê" trong tiếng Việt.',
    noteEn: 'Pronounced like "ne" in "nest".',
    example: 'ねこ (neko - con mèo / cat)',
    lessonSlug: 'hiragana-na',
  },
  no: {
    char: 'の',
    romaji: 'no',
    noteVi: 'Phát âm giống "nô" trong tiếng Việt.',
    noteEn: 'Pronounced like "no" in "note".',
    example: 'のり (nori - rong biển / seaweed)',
    lessonSlug: 'hiragana-na',
  },

  は: {
    char: 'は',
    romaji: 'ha',
    noteVi: 'Phát âm giống "ha" trong tiếng Việt.',
    noteEn: 'Pronounced like "ha" in "hot".',
    example: 'はな (hana - hoa / flower)',
    lessonSlug: 'hiragana-ha',
  },
  ひ: {
    char: 'ひ',
    romaji: 'hi',
    noteVi: 'Phát âm giống "hi" trong tiếng Việt.',
    noteEn: 'Pronounced like "he" in "here".',
    example: 'ひこうき (hikouki - máy bay / airplane)',
    lessonSlug: 'hiragana-ha',
  },
  ふ: {
    char: 'ふ',
    romaji: 'fu',
    noteVi: 'Phát âm thổi hơi nhẹ giữa fu và hu.',
    noteEn: 'Pronounced by blowing air between lips.',
    example: 'ふじさん (fujisan - núi Phú Sĩ)',
    lessonSlug: 'hiragana-ha',
  },
  へ: {
    char: 'へ',
    romaji: 'he',
    noteVi: 'Phát âm giống "hê" trong tiếng Việt.',
    noteEn: 'Pronounced like "he" in "help".',
    example: 'へや (heya - căn phòng / room)',
    lessonSlug: 'hiragana-ha',
  },
  ほ: {
    char: 'ほ',
    romaji: 'ho',
    noteVi: 'Phát âm giống "hô" trong tiếng Việt.',
    noteEn: 'Pronounced like "ho" in "home".',
    example: 'ほし (hoshi - ngôi sao / star)',
    lessonSlug: 'hiragana-ha',
  },

  ま: {
    char: 'ま',
    romaji: 'ma',
    noteVi: 'Phát âm giống "ma" trong tiếng Việt.',
    noteEn: 'Pronounced like "ma" in "mama".',
    example: 'まつ (matsu - cây thông / pine)',
    lessonSlug: 'hiragana-ma',
  },
  み: {
    char: 'み',
    romaji: 'mi',
    noteVi: 'Phát âm giống "mi" trong tiếng Việt.',
    noteEn: 'Pronounced like "me" in "meet".',
    example: 'みず (mizu - nước / water)',
    lessonSlug: 'hiragana-ma',
  },
  む: {
    char: 'む',
    romaji: 'mu',
    noteVi: 'Phát âm giống "mu" trong tiếng Việt.',
    noteEn: 'Pronounced like "moo" in "mood".',
    example: 'むし (mushi - côn trùng / insect)',
    lessonSlug: 'hiragana-ma',
  },
  め: {
    char: 'め',
    romaji: 'me',
    noteVi: 'Phát âm giống "mê" trong tiếng Việt.',
    noteEn: 'Pronounced like "me" in "met".',
    example: 'めがね (megane - mắt kính / glasses)',
    lessonSlug: 'hiragana-ma',
  },
  も: {
    char: 'も',
    romaji: 'mo',
    noteVi: 'Phát âm giống "mô" trong tiếng Việt.',
    noteEn: 'Pronounced like "mo" in "more".',
    example: 'もり (mori - khu rừng / forest)',
    lessonSlug: 'hiragana-ma',
  },

  や: {
    char: 'や',
    romaji: 'ya',
    noteVi: 'Phát âm giống "ya" trong tiếng Việt.',
    noteEn: 'Pronounced like "ya" in "yard".',
    example: 'やま (yama - núi / mountain)',
    lessonSlug: 'hiragana-ya',
  },
  ゆ: {
    char: 'ゆ',
    romaji: 'yu',
    noteVi: 'Phát âm giống "yu" trong tiếng Việt.',
    noteEn: 'Pronounced like "you" in English.',
    example: 'ゆき (yuki - tuyết / snow)',
    lessonSlug: 'hiragana-ya',
  },
  よ: {
    char: 'よ',
    romaji: 'yo',
    noteVi: 'Phát âm giống "yô" trong tiếng Việt.',
    noteEn: 'Pronounced like "yo" in "yoyo".',
    example: 'よる (yoru - ban đêm / night)',
    lessonSlug: 'hiragana-ya',
  },

  ら: {
    char: 'ら',
    romaji: 'ra',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between light L and R.',
    example: 'らくだ (rakuda - lạc đà / camel)',
    lessonSlug: 'hiragana-ra',
  },
  り: {
    char: 'り',
    romaji: 'ri',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between lee and ree.',
    example: 'りんご (ringo - quả táo / apple)',
    lessonSlug: 'hiragana-ra',
  },
  る: {
    char: 'る',
    romaji: 'ru',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between loo and roo.',
    example: 'るす (rusu - vắng nhà / away from home)',
    lessonSlug: 'hiragana-ra',
  },
  れ: {
    char: 'れ',
    romaji: 're',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between lay and ray.',
    example: 'れいぞうこ (reizouko - tủ lạnh / fridge)',
    lessonSlug: 'hiragana-ra',
  },
  ろ: {
    char: 'ろ',
    romaji: 'ro',
    noteVi: 'Phát âm trung gian lai giữa R và L.',
    noteEn: 'Pronounced between low and row.',
    example: 'ろうそく (rousoku - cây nến / candle)',
    lessonSlug: 'hiragana-ra',
  },

  わ: {
    char: 'わ',
    romaji: 'wa',
    noteVi: 'Phát âm tương tự "wa" tiếng Anh.',
    noteEn: 'Pronounced like "wa" in "water".',
    example: 'わたしたち (watashitachi - chúng tôi / we)',
    lessonSlug: 'hiragana-wa',
  },
  を: {
    char: 'を',
    romaji: 'wo',
    noteVi: 'Thường phát âm giống "o", dùng làm trợ từ.',
    noteEn: 'Pronounced like "o", used as a particle.',
    example: 'ほん を よむ (hon wo yomu - đọc sách)',
    lessonSlug: 'hiragana-wa',
  },
  ん: {
    char: 'ん',
    romaji: 'n',
    noteVi: 'Âm mũi duy nhất, đứng ở cuối từ.',
    noteEn: 'Nasal sound, pronounced like "n" or "m".',
    example: 'にほん (nihon - Nhật Bản / Japan)',
    lessonSlug: 'hiragana-wa',
  },
};

const SEIKUON_GRID: (string | null)[] = [
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
  'た',
  'ち',
  'つ',
  'て',
  'to', // wait, let's match exact keys
  'な',
  'に',
  'ぬ',
  'ね',
  'の',
  'は',
  'ひ',
  'ふ',
  'へ',
  'ほ',
  'ま',
  'み',
  'む',
  'め',
  'も',
  'や',
  null,
  'ゆ',
  null,
  'よ',
  'ら',
  'り',
  'る',
  'れ',
  'ろ',
  'わ',
  null,
  null,
  null,
  'を',
  'ん',
  null,
  null,
  null,
  null,
];

// Let's normalize keys
const CHAR_KEY_MAP: Record<string, string> = {
  to: 'と',
  ぬ: 'nu',
  ね: 'ne',
  の: 'no',
};

const getNormalizedChar = (item: string | null): string | null => {
  if (!item) return null;
  if (item === 'to') return 'と';
  return item;
};

const getNormalizedKey = (char: string): string => {
  if (char === 'と') return 'と';
  if (char === 'ぬ') return 'nu';
  if (char === 'ね') return 'ne';
  if (char === 'の') return 'no';
  return char;
};

export default function HiraganaPage() {
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
            setLessons(lessonsData.filter((l: Lesson) => l.slug.startsWith('hiragana-')));
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
    const key = getNormalizedKey(char);
    const detail = KANA_DETAILS[key];
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
          <h1>Bảng chữ cái Hiragana</h1>
          <span className="badge">Bảng chữ Hiragana</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="hiragana-container">
        <div className="hiragana-header">
          <h2>Học chữ cái Hiragana</h2>
          <p className="section-desc">
            Bảng chữ cái tiếng Nhật cơ bản Gojuon. Hãy nhấn vào từng chữ để nghe phát âm, xem chi
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
            {SEIKUON_GRID.map((item, idx) => {
              const char = getNormalizedChar(item);
              if (!char) {
                return <div key={`empty-${idx}`} className="char-card empty" />;
              }

              const key = getNormalizedKey(char);
              const detail = KANA_DETAILS[key];
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
              'が',
              'ぎ',
              'ぐ',
              'げ',
              'ご',
              'ざ',
              'じ',
              'ず',
              'ぜ',
              'ぞ',
              'だ',
              'ぢ',
              'づ',
              'で',
              'ど',
              'ば',
              'び',
              'ぶ',
              'べ',
              'ぼ',
              'ぱ',
              'ぴ',
              'ぷ',
              'ぺ',
              'ぽ',
            ].map((char) => {
              // Map Dakuon to base character lessons for completions
              const baseLessonMap: { [key: string]: string } = {
                が: 'hiragana-ka',
                ぎ: 'hiragana-ka',
                ぐ: 'hiragana-ka',
                げ: 'hiragana-ka',
                ご: 'hiragana-ka',
                ざ: 'hiragana-sa',
                じ: 'hiragana-sa',
                ず: 'hiragana-sa',
                ぜ: 'hiragana-sa',
                ぞ: 'hiragana-sa',
                だ: 'hiragana-ta',
                ぢ: 'hiragana-ta',
                づ: 'hiragana-ta',
                で: 'hiragana-ta',
                ど: 'hiragana-ta',
                ば: 'hiragana-ha',
                び: 'hiragana-ha',
                ぶ: 'hiragana-ha',
                べ: 'hiragana-ha',
                ぼ: 'hiragana-ha',
                ぱ: 'hiragana-ha',
                ぴ: 'hiragana-ha',
                ぷ: 'hiragana-ha',
                ぺ: 'hiragana-ha',
                ぽ: 'hiragana-ha',
              };
              const isCompleted = isLessonCompleted(baseLessonMap[char] || '');
              const romajiMap: { [key: string]: string } = {
                gah: 'ga',
                gi: 'gi',
                gu: 'gu',
                ge: 'ge',
                go: 'go',
                za: 'za',
                ji: 'ji',
                zu: 'zu',
                ze: 'ze',
                zo: 'zo',
                da: 'da',
                di: 'ji',
                du: 'zu',
                de: 'de',
                do: 'do',
                ba: 'ba',
                bi: 'bi',
                bu: 'bu',
                be: 'be',
                bo: 'bo',
                pa: 'pa',
                pi: 'pi',
                pu: 'pu',
                pe: 'pe',
                po: 'po',
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
              'きゃ',
              'きゅ',
              'きょ',
              'しゃ',
              'しゅ',
              'しょ',
              'ちゃ',
              'ちゅ',
              'ちょ',
              'にゃ',
              'にゅ',
              'にょ',
              'ひゃ',
              'ひゅ',
              'ひょ',
              'みゃ',
              'みゅ',
              'みょ',
              'りゃ',
              'りゅ',
              'りょ',
            ].map((char) => {
              const baseLessonMap: { [key: string]: string } = {
                き: 'hiragana-ka',
                し: 'hiragana-sa',
                ち: 'hiragana-ta',
                に: 'hiragana-na',
                ひ: 'hiragana-ha',
                み: 'hiragana-ma',
                り: 'hiragana-ra',
              };
              const isCompleted = isLessonCompleted(baseLessonMap[char[0]] || '');
              const romajiMap: { [key: string]: string } = {
                きゃ: 'kya',
                きゅ: 'kyu',
                きょ: 'kyo',
                しゃ: 'sha',
                しゅ: 'shu',
                しょ: 'sho',
                ちゃ: 'cha',
                ちゅ: 'chu',
                ちょ: 'cho',
                にゃ: 'nya',
                にゅ: 'nyu',
                にょ: 'nyo',
                ひゃ: 'hya',
                ひゅ: 'hyu',
                ひょ: 'hyo',
                みゃ: 'mya',
                みゅ: 'myu',
                みょ: 'myo',
                りゃ: 'rya',
                りゅ: 'ryu',
                りょ: 'ryo',
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
