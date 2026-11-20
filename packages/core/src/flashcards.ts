import type { TaskResult } from './lesson';

export type FlashcardSession = {
  queue: string[];
  total: number;
  missedWordIds: string[];
};

export function createFlashcardSession(wordIds: string[]): FlashcardSession {
  return { queue: [...wordIds], total: wordIds.length, missedWordIds: [] };
}

export function answerFlashcard(
  session: FlashcardSession,
  isKnown: boolean,
): FlashcardSession {
  const [currentWordId, ...rest] = session.queue;
  if (currentWordId === undefined) return session;
  if (isKnown) return { ...session, queue: rest };
  return {
    ...session,
    queue: [...rest, currentWordId],
    missedWordIds: session.missedWordIds.includes(currentWordId)
      ? session.missedWordIds
      : [...session.missedWordIds, currentWordId],
  };
}

export function isFlashcardSessionDone(session: FlashcardSession): boolean {
  return session.queue.length === 0;
}

export function flashcardsDone(session: FlashcardSession): number {
  return session.total - new Set(session.queue).size;
}

export function flashcardResult(session: FlashcardSession): TaskResult {
  return {
    correct: session.total - session.missedWordIds.length,
    total: session.total,
  };
}
