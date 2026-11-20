import type { LanguagePair } from '@daily-chunk/core';
import { describe, expect, it } from 'vitest';

import { createMockAiService } from '../src/ai/mock-ai-service';
import { translateTask } from '../src/mocks/lesson-tasks';
import { demoWords } from '../src/mocks/words';

const russian: LanguagePair = { targetLanguage: 'de', nativeLanguage: 'ru' };
const english: LanguagePair = { targetLanguage: 'de', nativeLanguage: 'en' };
const ai = createMockAiService();

describe('mock AI service', () => {
  it('normalises the typed demo words and flags a plural', async () => {
    const { words } = await ai.normaliseWords({
      languages: russian,
      typedText: 'Bahnhöfe\nFahrkarte\nverspätet\nGleis',
    });

    expect(words.map((word) => word.lemma)).toEqual([
      'Bahnhof',
      'Fahrkarte',
      'verspätet',
      'Gleis',
    ]);
    expect(words.map((word) => word.wasPluralised)).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(words[0]).toMatchObject({ typedText: 'Bahnhöfe', gender: 'masc' });
  });

  it('skips blank lines and words it does not know', async () => {
    const { words } = await ai.normaliseWords({
      languages: russian,
      typedText: '\n  Gleis  \nUnbekannt\n',
    });

    expect(words.map((word) => word.lemma)).toEqual(['Gleis']);
  });

  it.each([
    ['ru', 'Анна стоит на вокзале. Её поезд снова опаздывает.'],
    ['en', 'Anna is standing at the station. Her train is late again.'],
  ] as const)(
    'writes the story translation in the native language %s',
    async (nativeLanguage, firstTranslation) => {
      const story = await ai.generateStory({
        languages: { targetLanguage: 'de', nativeLanguage },
        words: demoWords,
      });

      expect(story.title).toBe('Der letzte Zug');
      expect(story.paragraphs).toHaveLength(3);
      expect(story.paragraphs[0]?.translation).toBe(firstTranslation);
    },
  );

  it('returns gap sentences with a hint in the native language', async () => {
    const { sentences } = await ai.generateGapSentences({
      languages: english,
      words: demoWords,
    });

    expect(sentences.map((sentence) => sentence.answer)).toEqual([
      'Fahrkarte',
      'vom',
    ]);
    expect(sentences[0]?.hint).toBe(
      'She is looking for her ticket in the bag.',
    );
    expect(sentences[0]?.options).toContain('Fahrkarte');
    for (const sentence of sentences) {
      expect(demoWords.map((word) => word.id)).toContain(sentence.wordId);
    }
  });

  it('corrects the demo mistake in the native language', async () => {
    const result = await ai.checkTranslation({
      languages: russian,
      prompt: translateTask.prompt.ru,
      attempt: translateTask.attempt,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.correction).toMatchObject({
      wrongWord: 'in',
      rightWord: 'am',
    });
    expect(result.correction?.explanation).toContain('на вокзале');
  });

  it('writes the gap hint in Russian when the native language is Russian', async () => {
    const { sentences } = await ai.generateGapSentences({
      languages: russian,
      words: demoWords,
    });

    expect(sentences[0]?.hint).toBe('Она ищет свой билет в сумке.');
  });

  it('flags a plural form as pluralised', async () => {
    const { words } = await ai.normaliseWords({
      languages: russian,
      typedText: 'Gleise',
    });

    expect(words[0]).toMatchObject({ lemma: 'Gleis', wasPluralised: true });
  });

  it('accepts the corrected sentence', async () => {
    const result = await ai.checkTranslation({
      languages: english,
      prompt: translateTask.prompt.en,
      attempt: translateTask.correction.corrected,
    });

    expect(result).toEqual({ isCorrect: true, correction: null });
  });

  it('scores the read aloud demo with a tip in the native language', async () => {
    const result = await ai.scorePronunciation({
      languages: english,
      expectedText: 'Anna steht am Bahnhof.',
      recordingUri: 'file:///recording.m4a',
    });

    expect(result).toMatchObject({
      scorePercent: 86,
      verdict: 'clear',
      retryWords: ['Fahrkarte', 'läuft'],
    });
    expect(result.tip).toContain('LOYFT');
  });
});
