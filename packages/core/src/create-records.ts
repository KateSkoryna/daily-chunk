import type { AppLanguage } from '@daily-chunk/i18n';

import type { NormalisedWord } from './ai';
import type { LanguagePair } from './language-pair';
import { defaultLevel } from './level';
import type { Profile } from './profile';
import type { Word } from './word';

export function wordIdFor(
  targetLanguage: LanguagePair['targetLanguage'],
  lemma: string,
): string {
  return `word-${targetLanguage}-${lemma.toLowerCase()}`;
}

export function createWordFromNormalised(
  normalisedWord: NormalisedWord,
  targetLanguage: LanguagePair['targetLanguage'],
  now: Date,
): Word {
  const timestamp = now.toISOString();
  return {
    id: wordIdFor(targetLanguage, normalisedWord.lemma),
    targetLanguage,
    lemma: normalisedWord.lemma,
    partOfSpeech: normalisedWord.partOfSpeech,
    ...(normalisedWord.gender && { gender: normalisedWord.gender }),
    ...(normalisedWord.forms && { forms: normalisedWord.forms }),
    sentence: normalisedWord.sentence,
    sentenceTranslations: normalisedWord.sentenceTranslations,
    ...(normalisedWord.tip && { tip: normalisedWord.tip }),
    translations: normalisedWord.translations,
    reviewStage: 0,
    nextReviewAt: null,
    learnedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function isNewWord(word: Word): boolean {
  return word.reviewStage === 0 && word.learnedAt === null;
}

export function createInitialProfile(
  languages: LanguagePair,
  appLanguage: AppLanguage,
  now: Date,
): Profile {
  const timestamp = now.toISOString();
  return {
    id: 'profile-local',
    languages,
    appLanguage,
    level: defaultLevel,
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
