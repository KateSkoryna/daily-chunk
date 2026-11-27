import type { ComponentMeta } from '../meta';

export const itemDotsMeta = {
  name: 'ItemDots',
  category: 'atom',
  description:
    'A row of small square dots, one per word or phrase inside a task. The current one is yellow, the others are dim. Tapping a dot jumps to that item. It owns no state: the screen says which item is current.',
  spec: 'DESIGN.md §9.3',
  props: {
    labels:
      'The accessible name of each dot, already translated, for example Card 2; its length is the number of dots',
    current: 'The current item, counting from 1',
    groupLabel: 'The accessible name of the row, already translated',
    onSelect: 'Called with the tapped item, counting from 1',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['LessonStepper', 'FlashcardsScreen', 'ListenScreen'],
    usedIn: ['Flashcards', 'Listen & shadow'],
    alternatives: {
      LessonStepper: 'The seven tasks of the lesson, not the items inside one',
    },
  },
  tokens: {
    color: ['primary', 'border', 'popover'],
    other: ['touch'],
  },
  accessibility: [
    'A toolbar named by groupLabel; every dot is a button named by its label',
    'The current dot is marked as the current step; the text counter next to it says the same in words',
    'Every dot has a touch area of at least 3rem',
  ],
  aiHints: {
    useWhen: ['A task that goes through several words or phrases one by one'],
    avoidWhen: ['More than about 10 items: the dots wrap into several rows'],
    invalid: [
      'A current item below 1 or above the number of labels',
      'Hard-coded labels: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
