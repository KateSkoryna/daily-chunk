import type { AppLanguage } from '@daily-chunk/i18n';
import type { GenderRole } from '@daily-chunk/languages';

export type MockWordCard = {
  gender: GenderRole;
  noun: string;
  pluralNoun: string;
  translations: Record<AppLanguage, string>;
  example: { target: string; translations: Record<AppLanguage, string> };
};

export const bahnhofCard = {
  gender: 'masc',
  noun: 'Bahnhof',
  pluralNoun: 'Bahnhöfe',
  translations: { ru: 'вокзал (м. р.)', en: 'station' },
  example: {
    target: 'Ich warte am Bahnhof.',
    translations: {
      ru: 'Я жду на вокзале.',
      en: 'I am waiting at the station.',
    },
  },
} satisfies MockWordCard;
