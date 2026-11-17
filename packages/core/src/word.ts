import type { GenderRole, TargetLanguage } from '@daily-chunk/languages';

import type { Translations } from './translations';

export const partsOfSpeech = ['noun', 'verb', 'adjective', 'other'] as const;

export type PartOfSpeech = (typeof partsOfSpeech)[number];

export type ReviewStage = 0 | 1 | 2 | 3 | 4 | 5;

export type Word = {
  id: string;
  targetLanguage: TargetLanguage;
  lemma: string;
  partOfSpeech: PartOfSpeech;
  gender?: GenderRole;
  forms?: string;
  sentence: string;
  sentenceTranslations: Translations;
  sourceUrl?: string;
  translations: Translations;
  reviewStage: ReviewStage;
  nextReviewAt: string | null;
  learnedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
