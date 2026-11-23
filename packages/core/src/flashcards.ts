import type { TaskResult } from './lesson';

export type FlashcardSession = {
  wordIds: string[];
  index: number;
};

export function createFlashcardSession(wordIds: string[]): FlashcardSession {
  return { wordIds: [...wordIds], index: 0 };
}

export function isFirstFlashcard(session: FlashcardSession): boolean {
  return session.index === 0;
}

export function isLastFlashcard(session: FlashcardSession): boolean {
  return session.index >= session.wordIds.length - 1;
}

export function nextFlashcard(session: FlashcardSession): FlashcardSession {
  if (isLastFlashcard(session)) return session;
  return { ...session, index: session.index + 1 };
}

export function previousFlashcard(session: FlashcardSession): FlashcardSession {
  if (isFirstFlashcard(session)) return session;
  return { ...session, index: session.index - 1 };
}

export function goToFlashcard(
  session: FlashcardSession,
  index: number,
): FlashcardSession {
  if (index < 0 || index >= session.wordIds.length) return session;
  return { ...session, index };
}

export function flashcardResult(session: FlashcardSession): TaskResult {
  return { correct: session.wordIds.length, total: session.wordIds.length };
}
