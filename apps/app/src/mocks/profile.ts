import type { Profile } from '@daily-chunk/core';

export const demoProfile = {
  id: 'profile-demo',
  languages: { targetLanguage: 'de', nativeLanguage: 'ru' },
  appLanguage: 'ru',
  xp: 1240,
  currentStreak: 12,
  longestStreak: 12,
  lastStudyDate: '2026-11-16',
  createdAt: '2026-11-01T08:00:00Z',
  updatedAt: '2026-11-16T20:00:00Z',
} satisfies Profile;
