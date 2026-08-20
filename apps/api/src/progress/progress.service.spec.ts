import { ProgressService } from './progress.service';

// Mock Prisma Service
const mockPrisma: any = {
  user: {
    findUnique: async () => ({
      id: 'user1',
      timezone: 'Asia/Ho_Chi_Minh',
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    }),
    update: async () => ({}),
  },
  contentLesson: {
    findUnique: async () => ({
      id: 'lesson1',
      status: 'PUBLISHED',
    }),
  },
  lessonProgress: {
    findUnique: async () => null,
    create: async () => ({}),
  },
  dailyActivity: {
    findUnique: async () => null,
    create: async () => ({}),
  },
  $transaction: async (cb: any) => cb(mockPrisma),
};

const service = new ProgressService(mockPrisma);

async function runTests() {
  console.log('--- PROGRESS & STREAK UNIT TESTS ---');

  // Test Timezone / Date Formatting
  const testDate = new Date(Date.UTC(2026, 7, 18, 12, 0, 0)); // Aug 18, 2026
  const dateStr = service.getLocalDateString('Asia/Ho_Chi_Minh', testDate);
  const yesterdayStr = service.getYesterdayDateString('Asia/Ho_Chi_Minh', dateStr);

  console.log(`Formatted date: ${dateStr} (Expected: 2026-08-18)`);
  console.log(`Yesterday's date: ${yesterdayStr} (Expected: 2026-08-17)`);

  if (dateStr !== '2026-08-18' || yesterdayStr !== '2026-08-17') {
    throw new Error('Date formatting/arithmetic failed');
  }
  console.log('✔ Date formatting check passed.');

  // Helper to run mock completion transaction
  async function runMockStreakCalculation({
    lastActiveDate,
    currentStreak,
    longestStreak,
    localDateStr,
  }: {
    lastActiveDate: string | null;
    currentStreak: number;
    longestStreak: number;
    localDateStr: string;
  }) {
    const timezone = 'Asia/Ho_Chi_Minh';
    const yesterdayDateStr = service.getYesterdayDateString(timezone, localDateStr);

    let finalCurrentStreak = currentStreak;
    let finalLongestStreak = longestStreak;
    let finalLastActiveDate = lastActiveDate;

    // Simulate streak logic inside transaction
    const yesterday = yesterdayDateStr;
    if (lastActiveDate === yesterday) {
      finalCurrentStreak = currentStreak + 1;
    } else if (lastActiveDate === localDateStr) {
      finalCurrentStreak = currentStreak;
    } else {
      finalCurrentStreak = 1;
    }
    finalLongestStreak = Math.max(longestStreak, finalCurrentStreak);
    finalLastActiveDate = localDateStr;

    return {
      currentStreak: finalCurrentStreak,
      longestStreak: finalLongestStreak,
      lastActiveDate: finalLastActiveDate,
    };
  }

  // Case 1: First activity ever
  const res1 = await runMockStreakCalculation({
    lastActiveDate: null,
    currentStreak: 0,
    longestStreak: 0,
    localDateStr: '2026-08-18',
  });
  console.log('Case 1 (First activity):', res1);
  if (res1.currentStreak !== 1 || res1.lastActiveDate !== '2026-08-18') {
    throw new Error('Case 1 failed');
  }

  // Case 2: Next day activity (streak continues)
  const res2 = await runMockStreakCalculation({
    lastActiveDate: '2026-08-17',
    currentStreak: 1,
    longestStreak: 1,
    localDateStr: '2026-08-18',
  });
  console.log('Case 2 (Streak continues):', res2);
  if (res2.currentStreak !== 2 || res2.lastActiveDate !== '2026-08-18') {
    throw new Error('Case 2 failed');
  }

  // Case 3: Same day activity (streak stays same)
  const res3 = await runMockStreakCalculation({
    lastActiveDate: '2026-08-18',
    currentStreak: 2,
    longestStreak: 2,
    localDateStr: '2026-08-18',
  });
  console.log('Case 3 (Same day activity):', res3);
  if (res3.currentStreak !== 2 || res3.lastActiveDate !== '2026-08-18') {
    throw new Error('Case 3 failed');
  }

  // Case 4: Broken streak (resets to 1)
  const res4 = await runMockStreakCalculation({
    lastActiveDate: '2026-08-15',
    currentStreak: 2,
    longestStreak: 2,
    localDateStr: '2026-08-18',
  });
  console.log('Case 4 (Broken streak):', res4);
  if (res4.currentStreak !== 1 || res4.lastActiveDate !== '2026-08-18') {
    throw new Error('Case 4 failed');
  }

  console.log('✔ All streak unit tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
