import type {
  LanguagePair,
  PartOfSpeech,
  ReviewStage,
  Translations,
} from '@daily-chunk/core';
import type { AppLanguage } from '@daily-chunk/i18n';
import type { GenderRole } from '@daily-chunk/languages';
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

export const wordTable = sqliteTable('word', {
  id: text('id').primaryKey(),
  targetLanguage: text('target_language')
    .$type<LanguagePair['targetLanguage']>()
    .notNull(),
  lemma: text('lemma').notNull(),
  partOfSpeech: text('part_of_speech').$type<PartOfSpeech>().notNull(),
  gender: text('gender').$type<GenderRole>(),
  forms: text('forms'),
  sentence: text('sentence').notNull(),
  sentenceTranslations: text('sentence_translations', { mode: 'json' })
    .$type<Translations>()
    .notNull(),
  sourceUrl: text('source_url'),
  translations: text('translations', { mode: 'json' })
    .$type<Translations>()
    .notNull(),
  reviewStage: integer('review_stage').$type<ReviewStage>().notNull(),
  nextReviewAt: text('next_review_at'),
  learnedAt: text('learned_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
