import type { Lesson } from './lesson';
import type { Word } from './word';

function isOpen(lesson: Lesson): boolean {
  return lesson.completedAt === null;
}

export function currentLessonNumber(lessons: Lesson[]): number {
  const openLesson = lessons.find(isOpen);
  if (openLesson) return openLesson.number;
  return (
    lessons.reduce((highest, lesson) => Math.max(highest, lesson.number), 0) + 1
  );
}

export function startLesson(
  lessons: Lesson[],
  words: Word[],
  now: Date,
): Lesson {
  const openLesson = lessons.find(isOpen);
  const wordIds = words.map((word) => word.id);
  if (openLesson) {
    return {
      ...openLesson,
      wordIds: [...new Set([...openLesson.wordIds, ...wordIds])],
    };
  }

  const number = currentLessonNumber(lessons);
  return {
    id: `lesson-${number}`,
    number,
    wordIds,
    taskResults: {},
    xpEarned: 0,
    startedAt: now.toISOString(),
    completedAt: null,
  };
}
