import type { AnswerExercise } from './ai';
import { shuffleOptions } from './quiz';
import type { Level } from './level';
import type { TaskResult } from './lesson';
import type { Word } from './word';

export const answerWordRange = {
  A1: { min: 3, max: 5 },
  A2: { min: 4, max: 7 },
  B1: { min: 6, max: 10 },
  B2: { min: 8, max: 13 },
  C1: { min: 10, max: 16 },
  C2: { min: 12, max: 20 },
} as const satisfies Record<Level, { min: number; max: number }>;

export type AnswerProblem = 'missing-word' | 'too-short' | 'too-long';

export type AnswerTile = { id: string; text: string };

export const mistakesBeforeHint = 3;

export type AnswerSession = {
  exerciseCount: number;
  index: number;
  mistakes: number[];
  mistakesInRow: number;
};

export function answerWords(answer: string): string[] {
  return answer.split(/\s+/).filter(Boolean);
}

function mentionsWord(answer: string, word: Word): boolean {
  const spellings = [word.lemma, ...(word.forms?.split(/[,/;\s]+/) ?? [])]
    .map((spelling) => spelling.trim().toLowerCase())
    .filter(Boolean);
  const lowerAnswer = answer.toLowerCase();
  return spellings.some((spelling) => lowerAnswer.includes(spelling));
}

export function answerProblems(
  exercises: AnswerExercise[],
  words: Word[],
  level: Level,
): AnswerProblem[] {
  const problems = new Set<AnswerProblem>();
  const { min, max } = answerWordRange[level];
  for (const exercise of exercises) {
    const wordCount = answerWords(exercise.answer).length;
    const word = words.find((candidate) => candidate.id === exercise.wordId);
    if (!word || !mentionsWord(exercise.answer, word)) {
      problems.add('missing-word');
    }
    if (wordCount < min) problems.add('too-short');
    if (wordCount > max) problems.add('too-long');
  }
  return [...problems];
}

export function answerTiles(answer: string, seed: string): AnswerTile[] {
  const tiles = answerWords(answer).map((text, index) => ({
    id: `${index}`,
    text,
  }));
  const shuffledIds = shuffleOptions(
    tiles.map((tile) => tile.id),
    seed,
  );
  const isUnchanged = shuffledIds.every((id, index) => id === `${index}`);
  const orderedIds =
    isUnchanged && shuffledIds.length > 1
      ? [...shuffledIds.slice(1), shuffledIds[0] as string]
      : shuffledIds;
  return orderedIds.map((id) => tiles[Number(id)] as AnswerTile);
}

export function expectedAnswerWord(
  answer: string,
  placedCount: number,
): string | undefined {
  return answerWords(answer)[placedCount];
}

export function createAnswerSession(exerciseCount: number): AnswerSession {
  return {
    exerciseCount,
    index: 0,
    mistakes: Array.from({ length: exerciseCount }, () => 0),
    mistakesInRow: 0,
  };
}

export function recordAnswerTap(
  session: AnswerSession,
  isRight: boolean,
): AnswerSession {
  if (isRight) return { ...session, mistakesInRow: 0 };
  return {
    ...session,
    mistakes: session.mistakes.map((count, index) =>
      index === session.index ? count + 1 : count,
    ),
    mistakesInRow: session.mistakesInRow + 1,
  };
}

export function shouldHintAnswerWord(session: AnswerSession): boolean {
  return session.mistakesInRow >= mistakesBeforeHint;
}

export function isLastAnswerExercise(session: AnswerSession): boolean {
  return session.index >= session.exerciseCount - 1;
}

export function nextAnswerExercise(session: AnswerSession): AnswerSession {
  if (isLastAnswerExercise(session)) return session;
  return { ...session, index: session.index + 1, mistakesInRow: 0 };
}

export function answerResult(session: AnswerSession): TaskResult {
  return {
    correct: session.mistakes.filter((count) => count === 0).length,
    total: session.exerciseCount,
  };
}
