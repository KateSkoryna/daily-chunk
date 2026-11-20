import type { Word } from '@daily-chunk/core';
import { describe, expect, it } from 'vitest';

import { demoWords, verspaetet } from '../src/mocks/words';
import { toWord, toWordRow } from '../src/storage/word-row';

describe('word row', () => {
  it.each(demoWords)(
    'turns $lemma into a row and back without losing anything',
    (word) => {
      expect(toWord(toWordRow(word))).toEqual(word);
    },
  );

  it('keeps a missing gender and forms as null in the row', () => {
    expect(toWordRow(verspaetet)).toMatchObject({ gender: null, forms: null });
  });

  it('keeps the review fields of a word that is already scheduled', () => {
    const scheduled: Word = {
      ...verspaetet,
      reviewStage: 3,
      nextReviewAt: '2026-11-27T10:00:00.000Z',
      sourceUrl: 'https://example.com/article',
    };

    expect(toWord(toWordRow(scheduled))).toEqual(scheduled);
  });
});
