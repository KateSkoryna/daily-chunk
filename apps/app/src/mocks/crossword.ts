import type {
  CrosswordEntry,
  CrosswordPuzzle,
  Translations,
  Word,
} from '@daily-chunk/core';
import type { NativeLanguage } from '@daily-chunk/languages';

export type MockCrosswordEntry = Omit<
  CrosswordEntry,
  'wordId' | 'translation'
> & { translations: Required<Translations> };

export const crosswordRows = 7;
export const crosswordColumns = 9;

export const crosswordEntries = [
  {
    number: 1,
    direction: 'down',
    row: 0,
    column: 2,
    answer: 'BAHNHOF',
    lemma: 'Bahnhof',
    gender: 'masc',
    clue: 'Ein Gebäude, in dem sich Reisende und Züge treffen.',
    translations: { ru: 'вокзал', en: 'station' },
  },
  {
    number: 2,
    direction: 'across',
    row: 0,
    column: 6,
    answer: 'ZUG',
    lemma: 'Zug',
    gender: 'masc',
    clue: 'Er fährt auf Schienen und hält am Bahnhof.',
    translations: { ru: 'поезд', en: 'train' },
  },
  {
    number: 3,
    direction: 'down',
    row: 0,
    column: 8,
    answer: 'GLEIS',
    lemma: 'Gleis',
    gender: 'neut',
    clue: 'Zwei Schienen mit einer Nummer, von denen der Zug abfährt.',
    translations: { ru: 'путь, платформа', en: 'platform' },
  },
  {
    number: 4,
    direction: 'across',
    row: 2,
    column: 0,
    answer: 'FAHRKARTE',
    lemma: 'Fahrkarte',
    gender: 'fem',
    clue: 'Ohne sie darfst du nicht mitfahren. Du kaufst sie am Automaten.',
    translations: { ru: 'билет', en: 'ticket' },
  },
] satisfies MockCrosswordEntry[];

export const crosswordGivenCells = ['2,2', '0,8', '2,8'];

export function crosswordPuzzleFor(
  words: Word[],
  nativeLanguage: NativeLanguage,
): CrosswordPuzzle {
  return {
    rows: crosswordRows,
    columns: crosswordColumns,
    givenCells: crosswordGivenCells,
    entries: crosswordEntries.map(({ translations, ...entry }) => ({
      ...entry,
      wordId: words.find((word) => word.lemma === entry.lemma)?.id ?? null,
      translation: translations[nativeLanguage],
    })),
  };
}
