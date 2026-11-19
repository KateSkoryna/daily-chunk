import type { ReviewStage } from './word';

export type ReviewSource = 'lesson' | 'review' | 'boss';

export type ReviewLog = {
  id: string;
  wordId: string;
  source: ReviewSource;
  wasCorrect: boolean;
  stageBefore: ReviewStage;
  stageAfter: ReviewStage;
  reviewedAt: string;
};
