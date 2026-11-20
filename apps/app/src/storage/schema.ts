import type { LanguagePair } from '@daily-chunk/core';
import type { AppLanguage } from '@daily-chunk/i18n';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const profileTable = sqliteTable('profile', {
  id: text('id').primaryKey(),
  targetLanguage: text('target_language')
    .$type<LanguagePair['targetLanguage']>()
    .notNull(),
  nativeLanguage: text('native_language')
    .$type<LanguagePair['nativeLanguage']>()
    .notNull(),
  appLanguage: text('app_language').$type<AppLanguage>().notNull(),
  xp: integer('xp').notNull(),
  currentStreak: integer('current_streak').notNull(),
  longestStreak: integer('longest_streak').notNull(),
  lastStudyDate: text('last_study_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
