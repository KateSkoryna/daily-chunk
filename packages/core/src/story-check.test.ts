import { describe, expect, it } from 'vitest';

import type { StoryResponse } from './ai';
import { storyProblems } from './story-check';
import type { Word } from './word';

const word = (lemma: string, forms?: string) =>
  ({ lemma, ...(forms && { forms }) }) as Word;

const sentences = (count: number) =>
  Array.from(
    { length: count },
    (_, index) => `Anna wartet am Bahnhof ${index}.`,
  ).join(' ');

const question = (answer = 'Gleis 3') => ({
  question: 'Von welchem Gleis fährt der Zug?',
  options: ['Gleis 3', 'Gleis 5', 'Gleis 7'],
  answer,
});

function story(overrides: Partial<StoryResponse> = {}): StoryResponse {
  return {
    level: 'B2',
    text: sentences(7),
    highlightedWords: [],
    translation: '',
    questions: Array.from({ length: 5 }, () => question()),
    ...overrides,
  };
}

describe('storyProblems', () => {
  it('accepts a story that follows every rule', () => {
    expect(storyProblems(story(), [word('Bahnhof')], 'B2')).toEqual([]);
  });

  it('finds a text that is too short or too long', () => {
    for (const count of [5, 9]) {
      expect(
        storyProblems(story({ text: sentences(count) }), [], 'B2'),
      ).toEqual(['sentence-count']);
    }
  });

  it('finds a lesson word that is missing, and accepts an inflected form', () => {
    expect(storyProblems(story(), [word('Fahrkarte')], 'B2')).toEqual([
      'missing-word',
    ]);
    expect(storyProblems(story(), [word('Zug', 'Bahnhof')], 'B2')).toEqual([]);
  });

  it('finds the wrong number of questions and options', () => {
    expect(
      storyProblems(story({ questions: [question()] }), [], 'B2'),
    ).toContain('question-count');
    const twoOptions = { ...question(), options: ['Gleis 3', 'Gleis 5'] };
    expect(
      storyProblems(story({ questions: Array(5).fill(twoOptions) }), [], 'B2'),
    ).toContain('option-count');
  });

  it('finds repeated options, an answer outside the options and a long answer', () => {
    const repeated = {
      ...question(),
      options: ['Gleis 3', 'Gleis 3', 'Gleis 7'],
    };
    const outside = question('Gleis 9');
    const long = {
      question: 'Wo wartet sie?',
      options: ['am alten Bahnhof in der Stadt', 'Gleis 5', 'Gleis 7'],
      answer: 'am alten Bahnhof in der Stadt',
    };
    const check = (item: ReturnType<typeof question>) =>
      storyProblems(story({ questions: Array(5).fill(item) }), [], 'B2');

    expect(check(repeated)).toContain('duplicate-options');
    expect(check(outside)).toContain('answer-not-in-options');
    expect(check(long)).toContain('answer-too-long');
  });

  it('finds a text more than two levels above the learner', () => {
    const lessonWords: Word[] = [];

    expect(storyProblems(story({ level: 'C2' }), lessonWords, 'B2')).toEqual(
      [],
    );
    expect(storyProblems(story({ level: 'C2' }), lessonWords, 'B1')).toEqual([
      'level-too-high',
    ]);
    expect(storyProblems(story({ level: 'C1' }), lessonWords, 'A1')).toEqual([
      'level-too-high',
    ]);
  });

  it('counts sentences with quotes and initials correctly', () => {
    const seven = [
      'Anna wartet.',
      '„Wo ist der Zug?“ fragt sie.',
      'Der Zug kommt z. B. später.',
      'Sie wartet weiter.',
      'Es regnet.',
      'Niemand sagt etwas.',
      'Dann kommt der Zug.',
    ].join(' ');
    expect(storyProblems(story({ text: seven }), [], 'B2')).toEqual([]);
  });
});
