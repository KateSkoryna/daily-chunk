import { describe, expect, it } from 'vitest';

import type { Lesson } from './lesson';
import {
  currentLessonNumber,
  maxWordsPerLesson,
  startLesson,
} from './start-lesson';
import type { Word } from './word';

const now = new Date('2026-11-20T10:00:00.000Z');
const words = [{ id: 'word-a' }, { id: 'word-b' }, { id: 'word-c' }] as Word[];

const finishedLesson: Lesson = {
  id: 'lesson-4',
  number: 4,
  wordIds: ['word-x'],
  taskResults: {},
  xpEarned: 100,
  startedAt: '2026-11-19T10:00:00.000Z',
  completedAt: '2026-11-19T10:20:00.000Z',
};

describe('startLesson', () => {
  it('makes lesson 1 with the given words when there are no lessons', () => {
    expect(startLesson([], words, now)).toEqual({
      id: 'lesson-1',
      number: 1,
      wordIds: ['word-a', 'word-b', 'word-c'],
      taskResults: {},
      xpEarned: 0,
      startedAt: '2026-11-20T10:00:00.000Z',
      completedAt: null,
    });
  });

  it('numbers the lesson after the highest finished one', () => {
    expect(startLesson([finishedLesson], words, now)).toMatchObject({
      id: 'lesson-5',
      number: 5,
    });
  });

  it('reuses the open lesson and adds the current words instead of starting another', () => {
    const openLesson: Lesson = {
      ...finishedLesson,
      id: 'lesson-5',
      number: 5,
      wordIds: ['word-a'],
      xpEarned: 0,
      startedAt: '2026-11-20T09:00:00.000Z',
      completedAt: null,
    };

    expect(startLesson([finishedLesson, openLesson], words, now)).toEqual({
      ...openLesson,
      wordIds: ['word-a', 'word-b', 'word-c'],
    });
  });

  it('keeps the words of the open lesson that are no longer new', () => {
    const openLesson: Lesson = {
      ...finishedLesson,
      id: 'lesson-5',
      number: 5,
      wordIds: ['word-old'],
      completedAt: null,
    };

    expect(startLesson([openLesson], words, now).wordIds).toEqual([
      'word-old',
      'word-a',
      'word-b',
      'word-c',
    ]);
  });
});

describe('currentLessonNumber', () => {
  const openLesson: Lesson = {
    ...finishedLesson,
    id: 'lesson-5',
    number: 5,
    completedAt: null,
  };

  it('is 1 when there are no lessons', () => {
    expect(currentLessonNumber([])).toBe(1);
  });

  it('is the number of the open lesson', () => {
    expect(currentLessonNumber([finishedLesson, openLesson])).toBe(5);
  });

  it('is the next number when every lesson is finished', () => {
    expect(currentLessonNumber([finishedLesson])).toBe(5);
  });
});

describe('startLesson with more words than a lesson takes', () => {
  const manyWords = Array.from({ length: 7 }, (_, index) => ({
    id: `word-${index}`,
  })) as Word[];

  it('takes the first 6 words and leaves the rest', () => {
    expect(maxWordsPerLesson).toBe(6);
    expect(startLesson([], manyWords, now).wordIds).toEqual([
      'word-0',
      'word-1',
      'word-2',
      'word-3',
      'word-4',
      'word-5',
    ]);
  });

  it('only fills the room left in an open lesson', () => {
    const openLesson: Lesson = {
      ...finishedLesson,
      id: 'lesson-5',
      number: 5,
      wordIds: ['open-1', 'open-2', 'open-3', 'open-4', 'open-5'],
      completedAt: null,
    };

    expect(startLesson([openLesson], manyWords, now).wordIds).toEqual([
      'open-1',
      'open-2',
      'open-3',
      'open-4',
      'open-5',
      'word-0',
    ]);
  });

  it('adds nothing to a full open lesson', () => {
    const fullLesson: Lesson = {
      ...finishedLesson,
      id: 'lesson-5',
      number: 5,
      wordIds: ['a', 'b', 'c', 'd', 'e', 'f'],
      completedAt: null,
    };

    expect(startLesson([fullLesson], manyWords, now).wordIds).toHaveLength(6);
  });

  it('does not repeat a word that is already in the open lesson', () => {
    const openLesson: Lesson = {
      ...finishedLesson,
      id: 'lesson-5',
      number: 5,
      wordIds: ['word-a'],
      completedAt: null,
    };

    expect(startLesson([openLesson], words, now).wordIds).toEqual([
      'word-a',
      'word-b',
      'word-c',
    ]);
  });
});
