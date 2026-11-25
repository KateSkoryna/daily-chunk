import type { Profile } from '@daily-chunk/core';

import type { profileTable } from './schema';

type ProfileRow = typeof profileTable.$inferSelect;

export function toProfileRow(profile: Profile): ProfileRow {
  return {
    id: profile.id,
    targetLanguage: profile.languages.targetLanguage,
    nativeLanguage: profile.languages.nativeLanguage,
    appLanguage: profile.appLanguage,
    level: profile.level,
    xp: profile.xp,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    lastStudyDate: profile.lastStudyDate,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    languages: {
      targetLanguage: row.targetLanguage,
      nativeLanguage: row.nativeLanguage,
    },
    appLanguage: row.appLanguage,
    level: row.level,
    xp: row.xp,
    currentStreak: row.currentStreak,
    longestStreak: row.longestStreak,
    lastStudyDate: row.lastStudyDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
