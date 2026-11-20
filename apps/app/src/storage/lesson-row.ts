import type { Lesson } from '@daily-chunk/core';

import type { lessonTable } from './schema';

type LessonRow = typeof lessonTable.$inferSelect;

export function toLessonRow(lesson: Lesson): LessonRow {
  return { ...lesson };
}

export function toLesson(row: LessonRow): Lesson {
  return { ...row };
}
