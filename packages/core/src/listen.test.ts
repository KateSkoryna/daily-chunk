import { describe, expect, it } from 'vitest';

import {
  createListenSession,
  goToListenPhrase,
  isFirstListenPhrase,
  isLastListenPhrase,
  listenResult,
  maxListenRepeats,
  nextListenPhrase,
  previousListenPhrase,
  recordListenRepeat,
} from './listen';

const wordIds = ['a', 'b', 'c'];

describe('listen session', () => {
  it('goes back a phrase and keeps its repeats', () => {
    const session = previousListenPhrase(
      nextListenPhrase(recordListenRepeat(createListenSession(wordIds))),
    );

    expect(session.phraseIndex).toBe(0);
    expect(session.repeats).toEqual([1, 0, 0]);
  });

  it('stays on the first phrase when going back', () => {
    const session = createListenSession(wordIds);

    expect(isFirstListenPhrase(session)).toBe(true);
    expect(previousListenPhrase(session)).toBe(session);
  });

  it('starts on the first phrase with no repeats', () => {
    expect(createListenSession(wordIds)).toEqual({
      wordIds: ['a', 'b', 'c'],
      phraseIndex: 0,
      repeats: [0, 0, 0],
    });
  });

  it('counts a repeat on the current phrase only', () => {
    const session = recordListenRepeat(
      nextListenPhrase(createListenSession(wordIds)),
    );

    expect(session.repeats).toEqual([0, 1, 0]);
  });

  it('stops counting at the most repeats', () => {
    let session = createListenSession(wordIds);
    for (let count = 0; count < maxListenRepeats + 2; count += 1) {
      session = recordListenRepeat(session);
    }

    expect(session.repeats[0]).toBe(maxListenRepeats);
  });

  it('moves to the next phrase and stays on the last one', () => {
    let session = createListenSession(wordIds);
    expect(isLastListenPhrase(session)).toBe(false);
    session = nextListenPhrase(nextListenPhrase(session));
    expect(isLastListenPhrase(session)).toBe(true);

    expect(nextListenPhrase(session)).toBe(session);
    expect(session.phraseIndex).toBe(2);
  });

  it('scores the phrases that were repeated at least once', () => {
    let session = createListenSession(wordIds);
    session = recordListenRepeat(session);
    session = nextListenPhrase(session);
    session = nextListenPhrase(session);
    session = recordListenRepeat(recordListenRepeat(session));

    expect(listenResult(session)).toEqual({ correct: 2, total: 3 });
  });

  it('scores nothing for a lesson without repeats', () => {
    expect(listenResult(createListenSession(wordIds))).toEqual({
      correct: 0,
      total: 3,
    });
  });

  it('jumps to a phrase and keeps the repeats', () => {
    const session = recordListenRepeat(createListenSession(wordIds));
    const jumped = goToListenPhrase(session, 2);

    expect(jumped.phraseIndex).toBe(2);
    expect(jumped.repeats).toEqual([1, 0, 0]);
    expect(goToListenPhrase(session, 3)).toBe(session);
  });
});
