import type { ComponentMeta } from '../meta';

export const crosswordMeta = {
  name: 'Crossword',
  category: 'organism',
  description:
    'The crossword grid of task 2. Square cells fill the width they get: below desktop at most `flashcard` (22.5rem), centred; from desktop the whole half of the row the screen gives it; a cell where no word runs stays empty. A numbered cell starts a word. Cells of the open word are raised with a cyan border, the next cell to type has a thick yellow border (pink after a wrong letter), a letter Chunk filled in has a dashed border, a solved lesson word is cyan and a solved link word is quiet. It owns no state: the screen passes the rows from crosswordGrid.',
  spec: 'design/screens/Crossword.dc.html, CrosswordActive.dc.html; DESIGN.md §9.3',
  props: {
    rows: 'The cells, row by row, from crosswordGrid; null where no word runs',
    onCellPress: 'Called with the key of a pressed cell, such as 2,2',
  },
  states: [
    'open',
    'given letter',
    'word open',
    'next cell',
    'wrong letter',
    'filled in by Chunk',
    'solved lesson word',
    'solved link word',
  ],
  relationships: {
    pairsWith: ['LetterKeyboard', 'CrosswordScreen'],
    usedIn: ['/lesson/crossword'],
  },
  tokens: {
    color: [
      'input',
      'card',
      'popover',
      'ring',
      'success',
      'border',
      'primary',
      'destructive',
      'foreground',
      'muted-foreground',
    ],
    typography: ['option', 'label-xs'],
    spacing: ['1'],
    other: ['border-3', 'flashcard'],
  },
  accessibility: [
    'The grid is a named group; every cell is a button named by its words and its letter, such as 1 down and 4 across, H',
    'Cells of the open word are marked as current; cells whose words are all solved are disabled',
    'A wrong letter is said in the feedback text with a cross, not only by the pink border',
    'Cells are smaller than 3rem on a phone: the owner allowed it (2026-11-27), because nine columns do not fit otherwise; they stretch with the screen',
  ],
  aiHints: {
    useWhen: ['The crossword task'],
    avoidWhen: ['Typing a whole answer: use a text field'],
    invalid: [
      'Rows not built by crosswordGrid',
      'Showing the letters of a word before it is typed or filled in',
    ],
  },
} satisfies ComponentMeta;
