import type { GenderRole } from '@daily-chunk/languages';

import type { TaskResult } from './lesson';
import type { Word } from './word';

export const crosswordDirections = ['across', 'down'] as const;

export type CrosswordDirection = (typeof crosswordDirections)[number];

export type CrosswordEntry = {
  number: number;
  direction: CrosswordDirection;
  row: number;
  column: number;
  /** the letters as they stand in the cells, upper case; ß stays ß, never SS */
  answer: string;
  /** the word as it is written, for the solved message */
  lemma: string;
  gender?: GenderRole;
  /** null for a link word: it joins the lesson words and does not count */
  wordId: string | null;
  clue: string;
  translation: string;
};

export type CrosswordPuzzle = {
  rows: number;
  columns: number;
  entries: CrosswordEntry[];
  givenCells: string[];
};

export type CrosswordCell = { key: string; letter: string };

export type CrosswordProblem =
  'missing-word' | 'outside-grid' | 'letter-clash' | 'given-outside-words';

export type CrosswordEvent = 'none' | 'right' | 'wrong' | 'filled' | 'solved';

export type CrosswordSession = {
  activeIndex: number | null;
  letters: Record<string, string>;
  wrongTries: Record<string, number>;
  filledCells: string[];
  hintedIndexes: number[];
  solvedIndexes: number[];
  lastEvent: CrosswordEvent;
  lastWrongLetter: string | null;
  lastSolvedIndex: number | null;
};

export const wrongTriesBeforeFill = 3;

export function crosswordCellKey(row: number, column: number): string {
  return `${row},${column}`;
}

export function crosswordCells(entry: CrosswordEntry): CrosswordCell[] {
  return [...entry.answer].map((letter, index) => ({
    key:
      entry.direction === 'down'
        ? crosswordCellKey(entry.row + index, entry.column)
        : crosswordCellKey(entry.row, entry.column + index),
    letter,
  }));
}

export function crosswordSolution(
  puzzle: CrosswordPuzzle,
): Map<string, string[]> {
  const lettersByCell = new Map<string, string[]>();
  for (const entry of puzzle.entries) {
    for (const cell of crosswordCells(entry)) {
      lettersByCell.set(cell.key, [
        ...(lettersByCell.get(cell.key) ?? []),
        cell.letter,
      ]);
    }
  }
  return lettersByCell;
}

function fitsGrid(puzzle: CrosswordPuzzle, entry: CrosswordEntry): boolean {
  const lastRow =
    entry.direction === 'down'
      ? entry.row + entry.answer.length - 1
      : entry.row;
  const lastColumn =
    entry.direction === 'across'
      ? entry.column + entry.answer.length - 1
      : entry.column;
  return (
    entry.row >= 0 &&
    entry.column >= 0 &&
    lastRow < puzzle.rows &&
    lastColumn < puzzle.columns
  );
}

export function crosswordProblems(
  puzzle: CrosswordPuzzle,
  words: Word[],
): CrosswordProblem[] {
  const problems = new Set<CrosswordProblem>();
  const solution = crosswordSolution(puzzle);
  const hasEveryWord = words.every((word) =>
    puzzle.entries.some((entry) => entry.wordId === word.id),
  );
  if (!hasEveryWord) problems.add('missing-word');
  if (!puzzle.entries.every((entry) => fitsGrid(puzzle, entry))) {
    problems.add('outside-grid');
  }
  for (const letters of solution.values()) {
    if (new Set(letters).size > 1) problems.add('letter-clash');
  }
  if (!puzzle.givenCells.every((key) => solution.has(key))) {
    problems.add('given-outside-words');
  }
  return [...problems];
}

function isEntryFilled(
  entry: CrosswordEntry,
  letters: Record<string, string>,
): boolean {
  return crosswordCells(entry).every((cell) => letters[cell.key]);
}

export function createCrosswordSession(
  puzzle: CrosswordPuzzle,
): CrosswordSession {
  const solution = crosswordSolution(puzzle);
  const letters = Object.fromEntries(
    puzzle.givenCells.map((key) => [key, solution.get(key)?.[0] ?? '']),
  );
  return {
    activeIndex: null,
    letters,
    wrongTries: {},
    filledCells: [],
    hintedIndexes: [],
    solvedIndexes: puzzle.entries.flatMap((entry, index) =>
      isEntryFilled(entry, letters) ? [index] : [],
    ),
    lastEvent: 'none',
    lastWrongLetter: null,
    lastSolvedIndex: null,
  };
}

export function selectCrosswordEntry(
  session: CrosswordSession,
  index: number,
): CrosswordSession {
  if (session.solvedIndexes.includes(index)) return session;
  return {
    ...session,
    activeIndex: index,
    lastEvent: 'none',
    lastWrongLetter: null,
  };
}

export function closeCrosswordEntry(
  session: CrosswordSession,
): CrosswordSession {
  return {
    ...session,
    activeIndex: null,
    lastEvent: 'none',
    lastWrongLetter: null,
  };
}

export function nextCrosswordCell(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
): CrosswordCell | undefined {
  if (session.activeIndex === null) return undefined;
  const entry = puzzle.entries[session.activeIndex];
  if (!entry) return undefined;
  return crosswordCells(entry).find((cell) => !session.letters[cell.key]);
}

export function crosswordEntryAt(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
  key: string,
): number | undefined {
  const openIndexes = puzzle.entries.flatMap((entry, index) =>
    !session.solvedIndexes.includes(index) &&
    crosswordCells(entry).some((cell) => cell.key === key)
      ? [index]
      : [],
  );
  const otherThanActive = openIndexes.find(
    (index) => index !== session.activeIndex,
  );
  const isInActive =
    session.activeIndex !== null && openIndexes.includes(session.activeIndex);
  return isInActive && otherThanActive !== undefined
    ? otherThanActive
    : openIndexes[0];
}

export function typeCrosswordLetter(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
  letter: string,
): CrosswordSession {
  const cell = nextCrosswordCell(puzzle, session);
  if (!cell || session.activeIndex === null) return session;
  const isRight = letter.toLowerCase() === cell.letter.toLowerCase();
  const tries = (session.wrongTries[cell.key] ?? 0) + (isRight ? 0 : 1);
  const isFilled = !isRight && tries >= wrongTriesBeforeFill;
  const letters =
    isRight || isFilled
      ? { ...session.letters, [cell.key]: cell.letter }
      : session.letters;
  const typed: CrosswordSession = {
    ...session,
    letters,
    wrongTries: isRight
      ? session.wrongTries
      : { ...session.wrongTries, [cell.key]: tries },
    filledCells: isFilled
      ? [...session.filledCells, cell.key]
      : session.filledCells,
    lastEvent: isRight ? 'right' : isFilled ? 'filled' : 'wrong',
    lastWrongLetter: isRight ? null : letter,
  };
  const newlySolved = puzzle.entries.flatMap((entry, index) =>
    !session.solvedIndexes.includes(index) && isEntryFilled(entry, letters)
      ? [index]
      : [],
  );
  if (!newlySolved.includes(session.activeIndex)) {
    return {
      ...typed,
      solvedIndexes: [...session.solvedIndexes, ...newlySolved],
    };
  }
  return {
    ...typed,
    activeIndex: null,
    solvedIndexes: [...session.solvedIndexes, ...newlySolved],
    lastEvent: 'solved',
    lastWrongLetter: null,
    lastSolvedIndex: session.activeIndex,
  };
}

export function showCrosswordHint(session: CrosswordSession): CrosswordSession {
  const { activeIndex } = session;
  if (activeIndex === null || session.hintedIndexes.includes(activeIndex)) {
    return session;
  }
  return {
    ...session,
    hintedIndexes: [...session.hintedIndexes, activeIndex],
    lastEvent: 'none',
    lastWrongLetter: null,
  };
}

export function wrongTriesLeft(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
): number {
  const cell = nextCrosswordCell(puzzle, session);
  const tries = cell ? (session.wrongTries[cell.key] ?? 0) : 0;
  return wrongTriesBeforeFill - tries;
}

export function areLessonWordsFound(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
): boolean {
  return puzzle.entries.every(
    (entry, index) =>
      entry.wordId === null || session.solvedIndexes.includes(index),
  );
}

export function crosswordResult(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
): TaskResult {
  const lessonEntries = puzzle.entries.filter((entry) => entry.wordId !== null);
  const correct = lessonEntries.filter((entry) =>
    crosswordCells(entry).every(
      (cell) =>
        session.letters[cell.key] && !session.filledCells.includes(cell.key),
    ),
  ).length;
  return { correct, total: lessonEntries.length };
}
