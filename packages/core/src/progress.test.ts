import { describe, expect, it } from 'vitest';

import { lessonXp, progressAfterLesson, streakBonusXp } from './progress';
import type { Profile } from './profile';

const profile: Profile = {
  id: 'profile-test',
  languages: { targetLanguage: 'de', nativeLanguage: 'ru' },
  appLanguage: 'ru',
  xp: 1000,
  currentStreak: 5,
  longestStreak: 9,
  lastStudyDate: '2026-11-19',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('progressAfterLesson', () => {
  it('extends the streak when the last lesson was yesterday', () => {
    expect(progressAfterLesson(profile, '2026-11-20')).toEqual({
      xp: 1000 + lessonXp,
      xpEarned: lessonXp,
      currentStreak: 6,
      longestStreak: 9,
      lastStudyDate: '2026-11-20',
    });
  });

  it('keeps the streak and gives no bonus for a second lesson on the same day', () => {
    const result = progressAfterLesson(
      { ...profile, currentStreak: 7, lastStudyDate: '2026-11-20' },
      '2026-11-20',
    );
    expect(result.currentStreak).toBe(7);
    expect(result.xpEarned).toBe(lessonXp);
  });

  it('resets the streak to 1 after a missed day', () => {
    const result = progressAfterLesson(profile, '2026-11-22');
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(9);
  });

  it('treats a gap of exactly two days as a missed day', () => {
    expect(progressAfterLesson(profile, '2026-11-21').currentStreak).toBe(1);
  });

  it('works across a year boundary', () => {
    const result = progressAfterLesson(
      { ...profile, lastStudyDate: '2026-12-31' },
      '2027-01-01',
    );
    expect(result.currentStreak).toBe(6);
  });

  it('never reports a streak below 1 after a lesson on the same day', () => {
    const result = progressAfterLesson(
      { ...profile, currentStreak: 0, lastStudyDate: '2026-11-20' },
      '2026-11-20',
    );
    expect(result.currentStreak).toBe(1);
  });

  it('keeps the streak when the clock is behind the last lesson date', () => {
    const result = progressAfterLesson(profile, '2026-11-18');
    expect(result.currentStreak).toBe(5);
  });

  it('starts a streak on the first lesson ever', () => {
    const result = progressAfterLesson(
      { ...profile, currentStreak: 0, longestStreak: 0, lastStudyDate: null },
      '2026-11-20',
    );
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('raises the longest streak when the current one passes it', () => {
    const result = progressAfterLesson(
      { ...profile, currentStreak: 9 },
      '2026-11-20',
    );
    expect(result.longestStreak).toBe(10);
  });

  it('works across a month boundary', () => {
    const result = progressAfterLesson(
      { ...profile, lastStudyDate: '2026-11-30' },
      '2026-12-01',
    );
    expect(result.currentStreak).toBe(6);
  });

  it.each(Object.entries(streakBonusXp))(
    'adds the bonus when the streak reaches %s days',
    (days, bonus) => {
      const reachedStreak = Number(days);
      const result = progressAfterLesson(
        { ...profile, currentStreak: reachedStreak - 1, longestStreak: 0 },
        '2026-11-20',
      );
      expect(result.xpEarned).toBe(lessonXp + bonus);
    },
  );
});
