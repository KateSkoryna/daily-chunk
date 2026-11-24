import { describe, expect, it } from 'vitest';

import type { NormalisedWord } from './ai';
import {
  createInitialProfile,
  createWordFromNormalised,
  isNewWord,
  wordIdFor,
} from './create-records';

const now = new Date('2026-11-20T10:00:00.000Z');

const normalisedNoun: NormalisedWord = {
  typedText: 'Bahnhöfe',
  wasPluralised: true,
  lemma: 'Bahnhof',
  partOfSpeech: 'noun',
  gender: 'masc',
  forms: 'die Bahnhöfe',
  sentence: 'Ich warte am Bahnhof.',
  sentenceTranslations: { en: 'I am waiting at the station.' },
  translations: { en: 'station' },
};

describe('createWordFromNormalised', () => {
  it('makes a new word with a stable id and no review yet', () => {
    expect(createWordFromNormalised(normalisedNoun, 'de', now)).toEqual({
      id: 'word-de-bahnhof',
      targetLanguage: 'de',
      lemma: 'Bahnhof',
      partOfSpeech: 'noun',
      gender: 'masc',
      forms: 'die Bahnhöfe',
      sentence: 'Ich warte am Bahnhof.',
      sentenceTranslations: { en: 'I am waiting at the station.' },
      translations: { en: 'station' },
      reviewStage: 0,
      nextReviewAt: null,
      learnedAt: null,
      createdAt: '2026-11-20T10:00:00.000Z',
      updatedAt: '2026-11-20T10:00:00.000Z',
    });
  });

  it('keeps the tip of a word that has one and leaves it out otherwise', () => {
    const tip = { en: 'No article before a number.' };

    expect(
      createWordFromNormalised({ ...normalisedNoun, tip }, 'de', now).tip,
    ).toEqual(tip);
    expect(
      createWordFromNormalised(normalisedNoun, 'de', now),
    ).not.toHaveProperty('tip');
  });

  it('leaves out the gender and forms of a word that has none', () => {
    const { gender, forms, ...adjective } = normalisedNoun;
    const word = createWordFromNormalised(
      { ...adjective, partOfSpeech: 'adjective', lemma: 'verspätet' },
      'de',
      now,
    );

    expect(gender).toBe('masc');
    expect(forms).toBe('die Bahnhöfe');
    expect(word).not.toHaveProperty('gender');
    expect(word).not.toHaveProperty('forms');
  });

  it('does not keep the typed text or the plural flag', () => {
    const word = createWordFromNormalised(normalisedNoun, 'de', now);

    expect(word).not.toHaveProperty('typedText');
    expect(word).not.toHaveProperty('wasPluralised');
  });
});

describe('wordIdFor', () => {
  it('gives the same id for the same word in any capitalisation', () => {
    expect(wordIdFor('de', 'Gleis')).toBe(wordIdFor('de', 'gleis'));
  });
});

describe('isNewWord', () => {
  const word = createWordFromNormalised(normalisedNoun, 'de', now);

  it('is true before the first review', () => {
    expect(isNewWord(word)).toBe(true);
  });

  it('is false once the word has a review stage or is learned', () => {
    expect(isNewWord({ ...word, reviewStage: 1 })).toBe(false);
    expect(isNewWord({ ...word, learnedAt: now.toISOString() })).toBe(false);
  });
});

describe('createInitialProfile', () => {
  it('starts with no XP and no streak', () => {
    expect(
      createInitialProfile(
        { targetLanguage: 'de', nativeLanguage: 'en' },
        'en',
        now,
      ),
    ).toEqual({
      id: 'profile-local',
      languages: { targetLanguage: 'de', nativeLanguage: 'en' },
      appLanguage: 'en',
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      createdAt: '2026-11-20T10:00:00.000Z',
      updatedAt: '2026-11-20T10:00:00.000Z',
    });
  });
});
