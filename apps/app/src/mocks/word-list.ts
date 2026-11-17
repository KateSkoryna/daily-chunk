import type { AppLanguage } from '@daily-chunk/i18n';
import type { GenderRole } from '@daily-chunk/languages';

export type MockListedWord = {
  gender: GenderRole;
  noun: string;
  forms: string;
  translations: Record<AppLanguage, string>;
};

export const listedWords = [
  {
    gender: 'masc',
    noun: 'Bahnhof',
    forms: 'die Bahnhöfe · des Bahnhofs',
    translations: { ru: 'вокзал', en: 'station' },
  },
  {
    gender: 'fem',
    noun: 'Fahrkarte',
    forms: 'die Fahrkarten',
    translations: { ru: 'билет', en: 'ticket' },
  },
  {
    gender: 'neut',
    noun: 'Gleis',
    forms: 'die Gleise',
    translations: { ru: 'путь', en: 'platform' },
  },
] satisfies MockListedWord[];
