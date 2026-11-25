import { describe, expect, it } from 'vitest';

import {
  answerProblems,
  answerResult,
  answerTiles,
  answerWordRange,
  createAnswerSession,
  expectedAnswerWord,
  isLastAnswerExercise,
  nextAnswerExercise,
  recordAnswerTap,
  shouldHintAnswerWord,
} from './answer-task';
import type { AnswerExercise } from './ai';
import { levels } from './level';
import type { Word } from './word';

const word = {
  id: 'w1',
  lemma: 'Bahnhof',
  forms: 'die Bahnhöfe',
} as Word;

const exercise = (answer: string): AnswerExercise => ({
  wordId: 'w1',
  question: 'Wo wartest du?',
  answer,
  translation: 'I am waiting at the station.',
});

describe('answerProblems', () => {
  it('accepts an answer inside the range of the level', () => {
    expect(
      answerProblems([exercise('Ich warte am Bahnhof.')], [word], 'A1'),
    ).toEqual([]);
  });

  it('flags an answer that is too short or too long for the level', () => {
    expect(answerProblems([exercise('Am Bahnhof.')], [word], 'B2')).toEqual([
      'too-short',
    ]);
    expect(
      answerProblems(
        [exercise('Ich warte am Bahnhof auf meinen Zug.')],
        [word],
        'A1',
      ),
    ).toEqual(['too-long']);
  });

  it('flags an answer without the lesson word', () => {
    expect(
      answerProblems([exercise('Ich warte hier auf dich.')], [word], 'A2'),
    ).toEqual(['missing-word']);
  });

  it('has a range for every level that grows with the level', () => {
    levels.forEach((level, index) => {
      const range = answerWordRange[level];
      expect(range.min).toBeLessThan(range.max);
      const previous = answerWordRange[levels[index - 1] ?? level];
      expect(range.max).toBeGreaterThanOrEqual(previous.max);
    });
  });
});

describe('answerTiles', () => {
  it('has one tile per word and never starts in the right order', () => {
    const answer = 'Ich warte am Bahnhof.';
    const tiles = answerTiles(answer, 'lesson-1:0');

    expect(tiles.map((tile) => tile.text).sort()).toEqual(
      answer.split(' ').sort(),
    );
    expect(tiles.map((tile) => tile.text).join(' ')).not.toBe(answer);
  });

  it('keeps the same order for the same seed', () => {
    expect(answerTiles('Ich warte am Bahnhof.', 'a')).toEqual(
      answerTiles('Ich warte am Bahnhof.', 'a'),
    );
  });

  it('gives repeated words their own ids', () => {
    const tiles = answerTiles('Ich sehe, was ich sehe.', 'x');

    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(5);
  });
});

describe('expectedAnswerWord', () => {
  it('names the word that comes next', () => {
    expect(expectedAnswerWord('Ich warte am Bahnhof.', 0)).toBe('Ich');
    expect(expectedAnswerWord('Ich warte am Bahnhof.', 3)).toBe('Bahnhof.');
    expect(expectedAnswerWord('Ich warte am Bahnhof.', 4)).toBeUndefined();
  });
});

describe('answer session', () => {
  it('counts the wrong taps of each question and asks for a hint after three in a row', () => {
    let session = createAnswerSession(2);
    session = recordAnswerTap(session, false);
    session = recordAnswerTap(session, false);

    expect(shouldHintAnswerWord(session)).toBe(false);

    session = recordAnswerTap(session, false);

    expect(shouldHintAnswerWord(session)).toBe(true);
    expect(session.mistakes).toEqual([3, 0]);

    session = recordAnswerTap(session, true);

    expect(shouldHintAnswerWord(session)).toBe(false);
    expect(session.mistakes).toEqual([3, 0]);
  });

  it('starts the next question without a hint and scores only clean questions', () => {
    let session = createAnswerSession(2);
    session = recordAnswerTap(session, false);
    session = recordAnswerTap(session, false);
    session = recordAnswerTap(session, false);
    session = nextAnswerExercise(session);

    expect(shouldHintAnswerWord(session)).toBe(false);
    expect(isLastAnswerExercise(session)).toBe(true);
    expect(nextAnswerExercise(session)).toBe(session);
    expect(answerResult(session)).toEqual({ correct: 1, total: 2 });
  });
});
