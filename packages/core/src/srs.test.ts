import { describe, expect, it } from 'vitest';

import { isDueForReview, scheduleAfterAnswer } from './srs';
import type { ReviewStage, Word } from './word';

const answeredAt = new Date('2026-11-20T10:00:00.000Z');

describe('scheduleAfterAnswer', () => {
  it.each([
    [0, '2026-11-21T10:00:00.000Z', 1],
    [1, '2026-11-23T10:00:00.000Z', 2],
    [2, '2026-11-27T10:00:00.000Z', 3],
    [3, '2026-12-04T10:00:00.000Z', 4],
    [4, '2026-12-11T10:00:00.000Z', 5],
  ] as const)(
    'correct at stage %i moves to stage %i and sets the next review',
    (stage, expectedNextReviewAt, expectedStage) => {
      expect(scheduleAfterAnswer(stage, true, answeredAt)).toEqual({
        reviewStage: expectedStage,
        nextReviewAt: expectedNextReviewAt,
        learnedAt: null,
      });
    },
  );

  it.each([0, 1, 2, 3, 4, 5] as ReviewStage[])(
    'wrong at stage %i goes back to stage 1 for tomorrow',
    (stage) => {
      expect(scheduleAfterAnswer(stage, false, answeredAt)).toEqual({
        reviewStage: 1,
        nextReviewAt: '2026-11-21T10:00:00.000Z',
        learnedAt: null,
      });
    },
  );

  it('correct at the 21 day review marks the word learned', () => {
    expect(scheduleAfterAnswer(5, true, answeredAt)).toEqual({
      reviewStage: 5,
      nextReviewAt: null,
      learnedAt: '2026-11-20T10:00:00.000Z',
    });
  });
});

describe('isDueForReview', () => {
  const word = {
    nextReviewAt: '2026-11-20T10:00:00.000Z',
    learnedAt: null,
  } as Word;

  it('is due at and after the review time', () => {
    expect(isDueForReview(word, answeredAt)).toBe(true);
    expect(isDueForReview(word, new Date('2026-11-25T00:00:00.000Z'))).toBe(
      true,
    );
  });

  it('is not due before the review time', () => {
    expect(isDueForReview(word, new Date('2026-11-20T09:59:59.000Z'))).toBe(
      false,
    );
  });

  it('is never due when it has no review time or is learned', () => {
    expect(isDueForReview({ ...word, nextReviewAt: null }, answeredAt)).toBe(
      false,
    );
    expect(
      isDueForReview(
        { ...word, learnedAt: '2026-11-01T00:00:00.000Z' },
        answeredAt,
      ),
    ).toBe(false);
  });
});
