import type { ComponentMeta } from '../meta';

export const sentenceBuilderMeta = {
  name: 'SentenceBuilder',
  category: 'molecule',
  description:
    'Builds a sentence from word tiles. Tiles in the pool are added to the answer line by a tap; a tap on a tile in the answer line sends it back. The screen owns both lists, so one extra tile can act as a trap.',
  spec: 'DESIGN.md §9.3, design/system/components/GapFill.md (sentence-build variant)',
  props: {
    answer:
      'The tiles in the answer line, in order; each has an id and its text',
    pool: 'The tiles still to place',
    onAdd: 'Called with the id of a pool tile that was pressed',
    onRemove: 'Called with the id of an answer tile that was pressed',
    answerLabel: 'Names the answer line for a screen reader, from i18n',
  },
  states: ['empty', 'partial', 'complete'],
  relationships: {
    composedOf: ['PressableFocus', 'Text'],
    usedIn: ['Boss round'],
    alternatives: {
      OptionGrid: 'Picking one word from a few is an option grid',
    },
  },
  tokens: {
    color: ['muted', 'input', 'field', 'foreground'],
    typography: ['option'],
    spacing: ['2', '3', '3.5'],
    other: ['touch'],
  },
  accessibility: [
    'Every tile is a button with its word as the name; the answer line is a group named from i18n',
    'Tiles are 3rem high, so they meet the touch size',
    'The order of the answer line is the order of the words, which a screen reader reads',
  ],
  aiHints: {
    useWhen: ['Building a sentence in the target language from its words'],
    avoidWhen: [
      'Choosing one word for one blank: use GapFill with an OptionGrid',
    ],
    invalid: [
      'Two tiles with the same id',
      'Hard-coded tile text: it comes from the lesson data',
    ],
  },
} satisfies ComponentMeta;
