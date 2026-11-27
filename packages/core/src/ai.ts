import type { LanguagePair } from './language-pair';
import type { Level } from './level';
import type { QuizLanguage } from './quiz';
import type { CrosswordPuzzle } from './crossword';
import type { Word } from './word';

export type AiRequest = {
  languages: LanguagePair;
};

export type NormalisedWord = Pick<
  Word,
  | 'lemma'
  | 'partOfSpeech'
  | 'gender'
  | 'forms'
  | 'sentence'
  | 'sentenceTranslations'
  | 'translations'
  | 'tip'
> & {
  typedText: string;
  /** true only when the typed text was a plural form turned into the singular */
  wasPluralised: boolean;
};

export type NormaliseRequest = AiRequest & { typedText: string };
export type NormaliseResponse = { words: NormalisedWord[] };

export type StoryQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type StoryRequest = AiRequest & {
  words: Word[];
  level: Level;
  quizLanguage: QuizLanguage;
};
export type StoryResponse = {
  level: Level;
  text: string;
  highlightedWords: string[];
  translation: string;
  questions: StoryQuestion[];
};

export type AnswerExercise = {
  wordId: string;
  question: string;
  answer: string;
  translation: string;
};

export type AnswerExercisesRequest = AiRequest & {
  words: Word[];
  level: Level;
};
export type AnswerExercisesResponse = { exercises: AnswerExercise[] };

export type CrosswordRequest = AiRequest & {
  words: Word[];
  level: Level;
};
export type CrosswordResponse = { puzzle: CrosswordPuzzle };

export type GapSentence = {
  wordId: string;
  before: string;
  after: string;
  answer: string;
  options: string[];
  hint: string;
};

export type GapSentencesRequest = AiRequest & { words: Word[] };
export type GapSentencesResponse = { sentences: GapSentence[] };

export type TranslationCheckRequest = AiRequest & {
  prompt: string;
  attempt: string;
};
export type TranslationCorrection = {
  wrongWord: string;
  rightWord: string;
  corrected: string;
  explanation: string;
};
export type TranslationCheckResponse = {
  isCorrect: boolean;
  correction: TranslationCorrection | null;
};

export type PronunciationVerdict = 'clear' | 'almost' | 'unclear';

export type PronunciationRequest = AiRequest & {
  expectedText: string;
  recordingUri: string;
};
export type PronunciationResponse = {
  scorePercent: number;
  verdict: PronunciationVerdict;
  retryWords: string[];
  tip: string;
};

export type AiService = {
  normaliseWords: (request: NormaliseRequest) => Promise<NormaliseResponse>;
  generateStory: (request: StoryRequest) => Promise<StoryResponse>;
  generateGapSentences: (
    request: GapSentencesRequest,
  ) => Promise<GapSentencesResponse>;
  generateCrossword: (request: CrosswordRequest) => Promise<CrosswordResponse>;
  generateAnswerExercises: (
    request: AnswerExercisesRequest,
  ) => Promise<AnswerExercisesResponse>;
  checkTranslation: (
    request: TranslationCheckRequest,
  ) => Promise<TranslationCheckResponse>;
  scorePronunciation: (
    request: PronunciationRequest,
  ) => Promise<PronunciationResponse>;
};
