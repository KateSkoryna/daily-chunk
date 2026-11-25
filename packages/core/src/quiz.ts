import type { Level } from './level';

export const quizQuestionCount = 5;
export const quizPassShare = 0.8;

export type QuizLanguage = 'target' | 'native';

export type QuizSession = {
  answers: (string | null)[];
};

export function quizLanguage(level: Level): QuizLanguage {
  return level === 'A1' || level === 'A2' ? 'native' : 'target';
}

export function createQuizSession(questionCount: number): QuizSession {
  return { answers: Array.from({ length: questionCount }, () => null) };
}

export function answerQuizQuestion(
  session: QuizSession,
  index: number,
  option: string,
): QuizSession {
  if (session.answers[index] !== null) return session;
  return {
    answers: session.answers.map((answer, answerIndex) =>
      answerIndex === index ? option : answer,
    ),
  };
}

export function quizScore(
  session: QuizSession,
  correctAnswers: string[],
): { correct: number; total: number } {
  return {
    correct: correctAnswers.filter(
      (answer, index) => session.answers[index] === answer,
    ).length,
    total: correctAnswers.length,
  };
}

export function quizCorrectNeeded(total: number): number {
  return Math.ceil(total * quizPassShare);
}

export function isQuizPassed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= quizPassShare;
}

export function shuffleOptions(options: string[], seed: string): string[] {
  let state = 0;
  for (const character of seed) {
    state = (Math.imul(state, 31) + character.charCodeAt(0)) >>> 0;
  }
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex] as string,
      shuffled[index] as string,
    ];
  }
  return shuffled;
}
