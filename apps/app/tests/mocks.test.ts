import { describe, expect, it } from 'vitest';

import { articleGapFill, ticketGapFill } from '../src/mocks/gap-fill';
import { doneDemo, lessonThirteen } from '../src/mocks/lesson';
import {
  derLetzteZug,
  readAloudResult,
  translateTask,
} from '../src/mocks/lesson-tasks';
import { homeDemo } from '../src/mocks/home';
import { demoWords } from '../src/mocks/words';

const wordIds = demoWords.map((word) => word.id);
const storyText = derLetzteZug.text;

describe('demo words', () => {
  it('have unique ids', () => {
    expect(new Set(wordIds).size).toBe(demoWords.length);
  });

  it('have a translation and a sentence translation in Russian and English', () => {
    for (const word of demoWords) {
      expect(word.translations.ru).toBeTruthy();
      expect(word.translations.en).toBeTruthy();
      expect(word.sentenceTranslations.ru).toBeTruthy();
      expect(word.sentenceTranslations.en).toBeTruthy();
    }
  });

  it('keep Russian in Cyrillic and English in Latin letters', () => {
    const cyrillic = /^[а-яё\s,().-]+$/i;
    const latin = /^[a-z\s,.'-]+$/i;

    for (const word of demoWords) {
      expect(word.translations.ru).toMatch(cyrillic);
      expect(word.translations.en).toMatch(latin);
      expect(word.sentenceTranslations.ru).toMatch(/[а-яё]/i);
      expect(word.sentenceTranslations.en).toMatch(latin);
    }
  });

  it('give every noun a gender and no other word a gender', () => {
    for (const word of demoWords) {
      expect(word.gender !== undefined).toBe(word.partOfSpeech === 'noun');
    }
  });

  it('use the word in its own sentence', () => {
    for (const word of demoWords) {
      expect(word.sentence).toContain(word.lemma);
    }
  });
});

describe('lesson 13', () => {
  it('lists only demo words', () => {
    expect(lessonThirteen.wordIds).toEqual(wordIds);
  });

  it('points the Done screen at demo words', () => {
    for (const wordId of doneDemo.weakWordIds) {
      expect(wordIds).toContain(wordId);
    }
  });
});

describe('lesson task content', () => {
  it('highlights only words that are in the story', () => {
    for (const word of derLetzteZug.highlightedWords) {
      expect(derLetzteZug.text).toContain(word);
    }
    expect(derLetzteZug.translations.ru).toBeTruthy();
    expect(derLetzteZug.translations.en).toBeTruthy();
  });

  it('asks to retry words that are in the story', () => {
    for (const word of readAloudResult.retryWords) {
      expect(storyText).toContain(word);
    }
  });

  it('corrects the attempt to the corrected sentence', () => {
    const { wrongWord, rightWord, corrected } = translateTask.correction;

    expect(
      translateTask.attempt.replace(` ${wrongWord} `, ` ${rightWord} `),
    ).toBe(corrected);
  });

  it('asks to use demo words', () => {
    for (const wordId of translateTask.wordIdsToUse) {
      expect(wordIds).toContain(wordId);
    }
  });

  it('offers the right answer among the options of each gap fill', () => {
    for (const gapFill of [ticketGapFill, articleGapFill]) {
      expect(gapFill.options).toContain(gapFill.answer);
    }
  });
});

describe('home', () => {
  it('types one field for each demo word, within the lesson limit', () => {
    expect(homeDemo.typedWords).toHaveLength(demoWords.length);
    expect(homeDemo.typedWords.length).toBeGreaterThanOrEqual(
      homeDemo.minimumWords,
    );
    expect(homeDemo.typedWords.length).toBeLessThanOrEqual(homeDemo.maxWords);
  });

  it('saves the typed plural as a demo word', () => {
    expect(wordIds).toContain(homeDemo.pluralInput.savedWordId);
  });
});
