import type { NativeLanguage } from '@daily-chunk/languages';

type Localised = Record<NativeLanguage, string>;

export type MockStoryParagraph = {
  text: string;
  highlightedWords: string[];
  translations: Localised;
};

export type MockStory = {
  title: string;
  paragraphs: MockStoryParagraph[];
};

export const derLetzteZug = {
  title: 'Der letzte Zug',
  paragraphs: [
    {
      text: 'Anna steht am Bahnhof. Ihr Zug ist wieder verspätet.',
      highlightedWords: ['Bahnhof', 'verspätet'],
      translations: {
        ru: 'Анна стоит на вокзале. Её поезд снова опаздывает.',
        en: 'Anna is standing at the station. Her train is late again.',
      },
    },
    {
      text: 'Sie sucht ihre Fahrkarte in der Tasche.',
      highlightedWords: ['Fahrkarte'],
      translations: {
        ru: 'Она ищет свой билет в сумке.',
        en: 'She is looking for her ticket in the bag.',
      },
    },
    {
      text: 'Endlich hört sie: „Der Zug nach Berlin fährt von Gleis drei.“ Anna lacht und läuft los.',
      highlightedWords: ['Gleis'],
      translations: {
        ru: 'Наконец она слышит: «Поезд на Берлин отправляется с пути три». Анна смеётся и бежит.',
        en: 'Finally she hears: "The train to Berlin leaves from platform three." Anna laughs and runs off.',
      },
    },
  ],
} satisfies MockStory;

export const readAloudResult = {
  durationSeconds: 24,
  scorePercent: 86,
  retryWords: ['Fahrkarte', 'läuft'],
  pronunciationTips: {
    ru: '«äu» звучит как «ой» в слове «бой»: ЛОЙФТ.',
    en: '"äu" sounds like "oy" in "boy": LOYFT.',
  } satisfies Localised,
};

export const translateTask = {
  prompt: {
    ru: 'Мой поезд опаздывает, я жду на вокзале.',
    en: 'My train is late, I am waiting at the station.',
  } satisfies Localised,
  wordIdsToUse: ['word-bahnhof', 'word-verspaetet'],
  attempt: 'Mein Zug ist verspätet, ich warte in Bahnhof.',
  correction: {
    wrongWord: 'in',
    rightWord: 'am',
    corrected: 'Mein Zug ist verspätet, ich warte am Bahnhof.',
    explanation: {
      ru: '«Warten am Bahnhof» = на вокзале. an + dem = am, потому что der Bahnhof.',
      en: '"Warten am Bahnhof" = at the station. an + dem = am, because der Bahnhof.',
    } satisfies Localised,
  },
};
