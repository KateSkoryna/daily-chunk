import { describe, expect, it } from 'vitest';

import {
  answerFlashcard,
  createFlashcardSession,
  flashcardResult,
  flashcardsDone,
  isFlashcardSessionDone,
} from './flashcards';

const wordIds = ['a', 'b', 'c'];

describe('flashcard session', () => {
  it('starts with every word in the queue and nothing missed', () => {
    expect(createFlashcardSession(wordIds)).toEqual({
      queue: ['a', 'b', 'c'],
      total: 3,
      missedWordIds: [],
    });
  });

  it('takes a known word out of the queue', () => {
    const session = answerFlashcard(createFlashcardSession(wordIds), true);

    expect(session.queue).toEqual(['b', 'c']);
    expect(session.missedWordIds).toEqual([]);
  });

  it('puts a missed word at the end of the queue and remembers it', () => {
    const session = answerFlashcard(createFlashcardSession(wordIds), false);

    expect(session.queue).toEqual(['b', 'c', 'a']);
    expect(session.missedWordIds).toEqual(['a']);
  });

  it('remembers a word once however often it is missed', () => {
    let session = createFlashcardSession(['a']);
    session = answerFlashcard(session, false);
    session = answerFlashcard(session, false);

    expect(session.queue).toEqual(['a']);
    expect(session.missedWordIds).toEqual(['a']);
  });

  it('is done when every word has been known', () => {
    let session = createFlashcardSession(['a', 'b']);
    session = answerFlashcard(session, true);
    expect(isFlashcardSessionDone(session)).toBe(false);
    session = answerFlashcard(session, true);

    expect(isFlashcardSessionDone(session)).toBe(true);
  });

  it('ignores an answer when the queue is empty', () => {
    const done = createFlashcardSession([]);

    expect(answerFlashcard(done, true)).toBe(done);
  });

  it('counts the words known so far, not the answers given', () => {
    let session = createFlashcardSession(wordIds);
    session = answerFlashcard(session, false);
    expect(flashcardsDone(session)).toBe(0);
    session = answerFlashcard(session, true);

    expect(flashcardsDone(session)).toBe(1);
  });

  it('scores the words known on the first try', () => {
    let session = createFlashcardSession(wordIds);
    session = answerFlashcard(session, false);
    session = answerFlashcard(session, true);
    session = answerFlashcard(session, true);
    session = answerFlashcard(session, true);

    expect(flashcardResult(session)).toEqual({ correct: 2, total: 3 });
  });
});
