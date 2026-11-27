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
  crossword: 20,
  listen: 40,
  read: 60,
  answer: 80,
  'gap-fill': 100,
  translate: 130,
} satisfies Record<LessonTaskType, number>;
