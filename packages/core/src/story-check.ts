import type { StoryResponse } from './ai';
import { levels, highestTextLevel, type Level } from './level';
import { quizQuestionCount } from './quiz';
import type { Word } from './word';

export const storySentenceRange = { min: 6, max: 8 } as const;
export const quizOptionCount = 3;
export const quizAnswerMaxWords = 3;

export type StoryProblem =
  | 'level-too-high'
  | 'sentence-count'
  | 'missing-word'
  | 'question-count'
  | 'option-count'
  | 'duplicate-options'
  | 'answer-not-in-options'
  | 'answer-too-long';

const sentenceBreak = /(?<=[.!?]["“”«»]?)\s+(?=["„“«»(]?\p{Lu})/u;
const endsWithInitial = /(?:^|\s)\p{L}\.$/u;

function sentenceCount(text: string): number {
  return text
    .split(sentenceBreak)
    .filter(Boolean)
    .reduce(
      (count, piece, index, pieces) =>
        index > 0 && endsWithInitial.test(pieces[index - 1] as string)
          ? count
          : count + 1,
      0,
    );
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function usesWord(text: string, word: Word): boolean {
  const spellings = [word.lemma, ...(word.forms?.split(/[,/;\s]+/) ?? [])]
    .map((spelling) => spelling.trim().toLowerCase())
    .filter(Boolean);
  const lowerText = text.toLowerCase();
  return spellings.some((spelling) => lowerText.includes(spelling));
}

export function storyProblems(
  story: StoryResponse,
  words: Word[],
  level: Level,
): StoryProblem[] {
  const problems = new Set<StoryProblem>();

  if (levels.indexOf(story.level) > levels.indexOf(highestTextLevel(level))) {
    problems.add('level-too-high');
  }
  const { text } = story;
  const sentences = sentenceCount(text);

  if (
    sentences < storySentenceRange.min ||
    sentences > storySentenceRange.max
  ) {
    problems.add('sentence-count');
  }
  if (words.some((word) => !usesWord(text, word))) {
    problems.add('missing-word');
  }
  if (story.questions.length !== quizQuestionCount) {
    problems.add('question-count');
  }
  for (const { options, answer } of story.questions) {
    if (options.length !== quizOptionCount) problems.add('option-count');
    if (new Set(options).size !== options.length) {
      problems.add('duplicate-options');
    }
    if (!options.includes(answer)) problems.add('answer-not-in-options');
    if (wordCount(answer) > quizAnswerMaxWords) {
      problems.add('answer-too-long');
    }
  }
  return [...problems];
}
