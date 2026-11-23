import type { Word } from '@daily-chunk/core';

import type { wordTable } from './schema';

type WordRow = typeof wordTable.$inferSelect;

export function toWordRow(word: Word): WordRow {
  return {
    id: word.id,
    targetLanguage: word.targetLanguage,
    lemma: word.lemma,
    partOfSpeech: word.partOfSpeech,
    gender: word.gender ?? null,
    forms: word.forms ?? null,
    sentence: word.sentence,
    sentenceTranslations: word.sentenceTranslations,
    sourceUrl: word.sourceUrl ?? null,
    tip: word.tip ?? null,
    translations: word.translations,
    reviewStage: word.reviewStage,
    nextReviewAt: word.nextReviewAt,
    learnedAt: word.learnedAt,
    createdAt: word.createdAt,
    updatedAt: word.updatedAt,
  };
}

export function toWord(row: WordRow): Word {
  return {
    id: row.id,
    targetLanguage: row.targetLanguage,
    lemma: row.lemma,
    partOfSpeech: row.partOfSpeech,
    ...(row.gender && { gender: row.gender }),
    ...(row.forms && { forms: row.forms }),
    sentence: row.sentence,
    sentenceTranslations: row.sentenceTranslations,
    ...(row.sourceUrl && { sourceUrl: row.sourceUrl }),
    ...(row.tip && { tip: row.tip }),
    translations: row.translations,
    reviewStage: row.reviewStage,
    nextReviewAt: row.nextReviewAt,
    learnedAt: row.learnedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
