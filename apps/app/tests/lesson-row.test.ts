import { describe, expect, it } from 'vitest';

import { lessonThirteen } from '../src/mocks/lesson';
import { toLesson, toLessonRow } from '../src/storage/lesson-row';

describe('lesson row', () => {
  it('turns a lesson into a row and back without losing anything', () => {
    expect(toLesson(toLessonRow(lessonThirteen))).toEqual(lessonThirteen);
  });

  it('keeps the task results and an open lesson', () => {
    const openLesson = {
      ...lessonThirteen,
      taskResults: { flashcards: { correct: 3, total: 4 } },
      completedAt: null,
    };

    expect(toLesson(toLessonRow(openLesson))).toEqual(openLesson);
  });
});
