export const lessonTaskTypes = [
  'flashcards',
  'crossword',
  'listen',
  'read',
  'answer',
  'gap-fill',
  'translate',
] as const;

export type LessonTaskType = (typeof lessonTaskTypes)[number];

export type TaskResult = {
  correct: number;
  total: number;
};

export type Lesson = {
  id: string;
  number: number;
  wordIds: string[];
  taskResults: Partial<Record<LessonTaskType, TaskResult>>;
  xpEarned: number;
  startedAt: string | null;
  completedAt: string | null;
};
