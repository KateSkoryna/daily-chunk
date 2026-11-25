import type { ComponentMeta } from '../meta';

export const sentenceBuilderMeta = {
  name: 'SentenceBuilder',
  category: 'molecule',
  description:
    'Builds a sentence from word tiles. Tiles in the pool are added to the answer line by a tap; a tap on a tile in the answer line sends it back when the screen gives onRemove; without it the answer line is fixed. A pool tile can carry a status: wrong (pink border, cross) or hint (cyan border, lamp). The screen owns both lists, so one extra tile can act as a trap.',
  spec: 'DESIGN.md §9.3, design/system/components/GapFill.md (sentence-build variant)',
  props: {
    answer:
      'The tiles in the answer line, in order; each has an id and its text',
    pool: 'The tiles still to place; a tile may have a status (wrong or hint) and a label that names it for a screen reader',
    onAdd: 'Called with the id of a pool tile that was pressed',
    onRemove:
      'Called with the id of an answer tile that was pressed; leave it out to make the answer line fixed',
    answerLabel: 'Names the answer line for a screen reader, from i18n',
  },
  states: ['empty', 'partial', 'complete', 'wrong tile', 'hint tile'],
  relationships: {
    composedOf: ['PressableFocus', 'Text', 'Icon'],
    usedIn: ['Boss round', 'Answer screen'],
    alternatives: {
      OptionGrid: 'Picking one word from a few is an option grid',
    },
  },
  tokens: {
    color: ['muted', 'input', 'field', 'destructive', 'foreground'],
    typography: ['option'],
    spacing: ['2', '3', '3.5'],
    other: ['touch'],
  },
  accessibility: [
    'A wrong or hint tile says so in its name and by its icon, never by colour alone',
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
