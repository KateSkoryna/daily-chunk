import type { TaskResult } from './lesson';

export const maxListenRepeats = 3;

export type ListenSession = {
  wordIds: string[];
  phraseIndex: number;
  repeats: number[];
};

export function createListenSession(wordIds: string[]): ListenSession {
  return {
    wordIds: [...wordIds],
    phraseIndex: 0,
    repeats: wordIds.map(() => 0),
  };
}

export function recordListenRepeat(session: ListenSession): ListenSession {
  return {
    ...session,
    repeats: session.repeats.map((count, index) =>
      index === session.phraseIndex
        ? Math.min(count + 1, maxListenRepeats)
        : count,
    ),
  };
}

export function isLastListenPhrase(session: ListenSession): boolean {
  return session.phraseIndex >= session.wordIds.length - 1;
}

export function isFirstListenPhrase(session: ListenSession): boolean {
  return session.phraseIndex === 0;
}

export function previousListenPhrase(session: ListenSession): ListenSession {
  if (isFirstListenPhrase(session)) return session;
  return { ...session, phraseIndex: session.phraseIndex - 1 };
}

export function goToListenPhrase(
  session: ListenSession,
  phraseIndex: number,
): ListenSession {
  if (phraseIndex < 0 || phraseIndex >= session.wordIds.length) return session;
  return { ...session, phraseIndex };
}

export function nextListenPhrase(session: ListenSession): ListenSession {
  if (isLastListenPhrase(session)) return session;
  return { ...session, phraseIndex: session.phraseIndex + 1 };
}

export function listenResult(session: ListenSession): TaskResult {
  return {
    correct: session.repeats.filter((count) => count > 0).length,
    total: session.wordIds.length,
  };
}
