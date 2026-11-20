import type { ReviewStage, Word } from './word';

export const daysUntilReviewByStage = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 21,
} as const;

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type ReviewSchedule = Pick<
  Word,
  'reviewStage' | 'nextReviewAt' | 'learnedAt'
>;

const lastStage: ReviewStage = 5;

function addDays(from: Date, days: number): string {
  return new Date(from.getTime() + days * millisecondsPerDay).toISOString();
}

export function scheduleAfterAnswer(
  stage: ReviewStage,
  wasCorrect: boolean,
  answeredAt: Date,
): ReviewSchedule {
  if (!wasCorrect) {
    return {
      reviewStage: 1,
      nextReviewAt: addDays(answeredAt, daysUntilReviewByStage[1]),
      learnedAt: null,
    };
  }
  if (stage === lastStage) {
    return {
      reviewStage: lastStage,
      nextReviewAt: null,
      learnedAt: answeredAt.toISOString(),
    };
  }
  const nextStage = (stage + 1) as keyof typeof daysUntilReviewByStage;
  return {
    reviewStage: nextStage,
    nextReviewAt: addDays(answeredAt, daysUntilReviewByStage[nextStage]),
    learnedAt: null,
  };
}

export function isDueForReview(word: Word, now: Date): boolean {
  return (
    word.learnedAt === null &&
    word.nextReviewAt !== null &&
    new Date(word.nextReviewAt).getTime() <= now.getTime()
  );
}
