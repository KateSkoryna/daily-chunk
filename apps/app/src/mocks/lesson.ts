import type { Lesson, LessonTaskType } from '@daily-chunk/core';

import { demoWords } from './words';

export const lessonThirteen = {
  id: 'lesson-13',
  number: 13,
  wordIds: demoWords.map((word) => word.id),
  taskResults: {},
  xpEarned: 140,
  startedAt: '2026-11-17T08:10:00Z',
  completedAt: '2026-11-17T08:35:00Z',
} satisfies Lesson;

export const doneDemo = {
  streakDays: 13,
  accuracyPercent: 88,
  weakWordIds: ['word-fahrkarte'],
  bossRound: { lessonsDone: 4, lessonsTotal: 5 },
};

export const stepXpDemo = {
  flashcards: 0,
  listen: 20,
  read: 40,
  record: 60,
  'gap-fill': 80,
  translate: 110,
} satisfies Record<LessonTaskType, number>;
