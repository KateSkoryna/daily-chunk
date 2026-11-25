import type { Lesson } from './lesson';
import type { Word } from './word';

export const maxWordsPerLesson = 6;

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
  const takenIds = new Set(openLesson?.wordIds);
  const waitingIds = [
    ...new Set(
      words.map((word) => word.id).filter((wordId) => !takenIds.has(wordId)),
    ),
  ];
  const room = maxWordsPerLesson - (openLesson?.wordIds.length ?? 0);
  const wordIds = waitingIds.slice(0, Math.max(0, room));
  if (openLesson) {
    return { ...openLesson, wordIds: [...openLesson.wordIds, ...wordIds] };
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
