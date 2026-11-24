import type { Word } from '@daily-chunk/core';

const addedAt = '2026-11-17T08:00:00Z';

const newWord = {
  targetLanguage: 'de',
  reviewStage: 0,
  nextReviewAt: null,
  learnedAt: null,
  createdAt: addedAt,
  updatedAt: addedAt,
} satisfies Partial<Word>;

export const bahnhof = {
  ...newWord,
  id: 'word-bahnhof',
  lemma: 'Bahnhof',
  partOfSpeech: 'noun',
  gender: 'masc',
  forms: 'die Bahnhöfe',
  sentence: 'Ich warte am Bahnhof.',
  sentenceTranslations: {
    ru: 'Я жду на вокзале.',
    en: 'I am waiting at the station.',
  },
  translations: { ru: 'вокзал', en: 'station' },
} satisfies Word;

export const fahrkarte = {
  ...newWord,
  id: 'word-fahrkarte',
  lemma: 'Fahrkarte',
  partOfSpeech: 'noun',
  gender: 'fem',
  forms: 'die Fahrkarten',
  sentence: 'Sie sucht ihre Fahrkarte in der Tasche.',
  sentenceTranslations: {
    ru: 'Она ищет свой билет в сумке.',
    en: 'She is looking for her ticket in the bag.',
  },
  translations: { ru: 'билет (на проезд)', en: 'ticket' },
} satisfies Word;

export const verspaetet = {
  ...newWord,
  id: 'word-verspaetet',
  lemma: 'verspätet',
  partOfSpeech: 'adjective',
  sentence: 'Ihr Zug ist wieder verspätet.',
  sentenceTranslations: {
    ru: 'Её поезд снова опаздывает.',
    en: 'Her train is late again.',
  },
  translations: { ru: 'опоздавший, с опозданием', en: 'late, delayed' },
} satisfies Word;

export const gleis = {
  ...newWord,
  id: 'word-gleis',
  lemma: 'Gleis',
  partOfSpeech: 'noun',
  gender: 'neut',
  forms: 'die Gleise',
  sentence: 'Der Zug fährt heute von Gleis drei ab.',
  sentenceTranslations: {
    ru: 'Поезд сегодня отправляется с третьего пути.',
    en: 'The train leaves from platform three today.',
  },
  tip: {
    ru: 'Перед числом артикль не нужен: «von Gleis drei», а не «vom Gleis drei».',
    en: 'No article before a number: "von Gleis drei", not "vom Gleis drei".',
  },
  translations: { ru: 'путь, платформа', en: 'platform' },
} satisfies Word;

export const demoWords: Word[] = [bahnhof, fahrkarte, verspaetet, gleis];
