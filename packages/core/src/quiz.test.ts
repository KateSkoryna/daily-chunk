import { describe, expect, it } from 'vitest';

import {
  answerQuizQuestion,
  createQuizSession,
  isQuizPassed,
  quizLanguage,
  quizScore,
  shuffleOptions,
} from './quiz';

describe('quiz', () => {
  it('asks in the native language for A1 and A2 and in the target language from B1', () => {
    expect(quizLanguage('A1')).toBe('native');
    expect(quizLanguage('A2')).toBe('native');
    expect(quizLanguage('B1')).toBe('target');
    expect(quizLanguage('C1')).toBe('target');
  });

  it('starts with no answers', () => {
    expect(createQuizSession(3).answers).toEqual([null, null, null]);
  });

  it('keeps the first answer to a question', () => {
    const first = answerQuizQuestion(createQuizSession(2), 0, 'Gleis 3');
    const second = answerQuizQuestion(first, 0, 'Gleis 5');

    expect(second.answers).toEqual(['Gleis 3', null]);
  });

  it('counts the right answers', () => {
    let session = createQuizSession(3);
    session = answerQuizQuestion(session, 0, 'a');
    session = answerQuizQuestion(session, 1, 'x');

    expect(quizScore(session, ['a', 'b', 'c'])).toEqual({
      correct: 1,
      total: 3,
    });
  });

  it('passes at 80% or better', () => {
    expect(isQuizPassed(4, 5)).toBe(true);
    expect(isQuizPassed(5, 5)).toBe(true);
    expect(isQuizPassed(3, 5)).toBe(false);
    expect(isQuizPassed(0, 0)).toBe(false);
  });

  it('shuffles the same way for the same seed and keeps every option', () => {
    const options = ['Gleis 3', 'Gleis 5', 'Gleis 7'];

    expect(shuffleOptions(options, 'lesson-1:0')).toEqual(
      shuffleOptions(options, 'lesson-1:0'),
    );
    expect([...shuffleOptions(options, 'lesson-1:0')].sort()).toEqual(options);
    expect(options).toEqual(['Gleis 3', 'Gleis 5', 'Gleis 7']);
  });
});
