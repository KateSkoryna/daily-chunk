import { describe, expect, it } from 'vitest';

import {
  createFlashcardSession,
  goToFlashcard,
  flashcardResult,
  isFirstFlashcard,
  isLastFlashcard,
  nextFlashcard,
  previousFlashcard,
} from './flashcards';

const wordIds = ['a', 'b', 'c'];

describe('flashcard session', () => {
  it('starts on the first card', () => {
    expect(createFlashcardSession(wordIds)).toEqual({
      wordIds: ['a', 'b', 'c'],
      index: 0,
    });
  });

  it('goes to the next card and back to the previous one', () => {
    const second = nextFlashcard(createFlashcardSession(wordIds));

    expect(second.index).toBe(1);
    expect(previousFlashcard(second).index).toBe(0);
  });

  it('stays on the first card when going back from it', () => {
    const first = createFlashcardSession(wordIds);

    expect(isFirstFlashcard(first)).toBe(true);
    expect(previousFlashcard(first)).toBe(first);
  });

  it('stays on the last card when going forward from it', () => {
    const last = nextFlashcard(nextFlashcard(createFlashcardSession(wordIds)));

    expect(isLastFlashcard(last)).toBe(true);
    expect(nextFlashcard(last)).toBe(last);
    expect(last.index).toBe(2);
  });

  it('knows a one card session is both first and last', () => {
    const only = createFlashcardSession(['a']);

    expect(isFirstFlashcard(only)).toBe(true);
    expect(isLastFlashcard(only)).toBe(true);
  });

  it('scores every card as seen', () => {
    expect(flashcardResult(createFlashcardSession(wordIds))).toEqual({
      correct: 3,
      total: 3,
    });
  });

  it('jumps to a card and ignores a card that does not exist', () => {
    const session = createFlashcardSession(wordIds);

    expect(goToFlashcard(session, 2).index).toBe(2);
    expect(goToFlashcard(session, 3)).toBe(session);
    expect(goToFlashcard(session, -1)).toBe(session);
  });
});
