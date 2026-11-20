import type {
  AiService,
  NormalisedWord,
  TranslationCorrection,
  Word,
} from '@daily-chunk/core';

import { articleGapFill, ticketGapFill } from '../mocks/gap-fill';
import {
  derLetzteZug,
  readAloudResult,
  translateTask,
} from '../mocks/lesson-tasks';
import { demoWords } from '../mocks/words';

function findDemoWord(
  typedWord: string,
): { word: Word; wasPluralised: boolean } | undefined {
  const exactMatch = demoWords.find((word) => word.lemma === typedWord);
  if (exactMatch) return { word: exactMatch, wasPluralised: false };
  const pluralMatch = demoWords.find((word) =>
    word.forms?.endsWith(` ${typedWord}`),
  );
  return pluralMatch && { word: pluralMatch, wasPluralised: true };
}

function toNormalisedWord(
  word: Word,
  typedText: string,
  wasPluralised: boolean,
): NormalisedWord {
  return {
    typedText,
    wasPluralised,
    lemma: word.lemma,
    partOfSpeech: word.partOfSpeech,
    gender: word.gender,
    forms: word.forms,
    sentence: word.sentence,
    sentenceTranslations: word.sentenceTranslations,
    translations: word.translations,
  };
}

export function createMockAiService(): AiService {
  return {
    async normaliseWords({ typedText }) {
      const typedWords = typedText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const words = typedWords.flatMap((typedWord) => {
        const match = findDemoWord(typedWord);
        return match
          ? [toNormalisedWord(match.word, typedWord, match.wasPluralised)]
          : [];
      });
      return { words };
    },

    async generateStory({ languages }) {
      return {
        title: derLetzteZug.title,
        paragraphs: derLetzteZug.paragraphs.map((paragraph) => ({
          text: paragraph.text,
          highlightedWords: paragraph.highlightedWords,
          translation: paragraph.translations[languages.nativeLanguage],
        })),
      };
    },

    async generateGapSentences({ languages }) {
      const { nativeLanguage } = languages;
      return {
        sentences: [
          { wordId: 'word-fahrkarte', ...ticketGapFill },
          { wordId: 'word-gleis', ...articleGapFill },
        ].map(({ hints, ...sentence }) => ({
          ...sentence,
          hint: hints[nativeLanguage],
        })),
      };
    },

    async checkTranslation({ languages, attempt }) {
      const { correction } = translateTask;
      const isCorrect = attempt.trim() === correction.corrected;
      const mockCorrection: TranslationCorrection = {
        wrongWord: correction.wrongWord,
        rightWord: correction.rightWord,
        corrected: correction.corrected,
        explanation: correction.explanation[languages.nativeLanguage],
      };
      return {
        isCorrect,
        correction: isCorrect ? null : mockCorrection,
      };
    },

    async scorePronunciation({ languages }) {
      return {
        scorePercent: readAloudResult.scorePercent,
        verdict: readAloudResult.verdict,
        retryWords: readAloudResult.retryWords,
        tip: readAloudResult.pronunciationTips[languages.nativeLanguage],
      };
    },
  };
}
