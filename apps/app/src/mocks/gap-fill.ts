import type { AppLanguage } from '@daily-chunk/i18n';

export type MockGapFill = {
  before: string;
  after: string;
  answer: string;
  options: string[];
  hints: Record<AppLanguage, string>;
};

export const ticketGapFill = {
  before: 'Sie sucht ihre',
  after: 'in der Tasche.',
  answer: 'Fahrkarte',
  options: ['Fahrkarte', 'Fahrkarten', 'Bahnhof', 'Gleis'],
  hints: {
    ru: 'Она ищет свой билет в сумке.',
    en: 'She is looking for her ticket in the bag.',
  },
} satisfies MockGapFill;

export const articleGapFill = {
  before: 'Der Zug fährt',
  after: 'Gleis drei.',
  answer: 'vom',
  options: ['vom', 'von der', 'von den'],
  hints: {
    ru: 'von + dem = vom. «Gleis» среднего рода → dem.',
    en: 'von + dem = vom. "Gleis" is das → dem.',
  },
} satisfies MockGapFill;
