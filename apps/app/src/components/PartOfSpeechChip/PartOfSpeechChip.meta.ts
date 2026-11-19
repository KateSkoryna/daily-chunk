import type { ComponentMeta } from '../meta';

export const partOfSpeechChipMeta = {
  name: 'PartOfSpeechChip',
  category: 'atom',
  description:
    'A grey dashed tag for a word that has no article, such as an adjective. It sits where ArticleChip sits, so every word row starts with a tag of the same size. The label is the part of speech, already translated.',
  spec: 'DESIGN.md §9.3, design/screens/Confirm.dc.html (the ADJ row)',
  props: {
    label: 'The part of speech, already translated, for example ADJ',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['ArticleChip', 'ListGroup'],
    alternatives: {
      ArticleChip: 'A noun has a gender, so it gets an article tag',
    },
    usedIn: ['Confirm', 'Translate (the words to use)'],
  },
  tokens: {
    color: ['muted-foreground'],
    typography: ['chip'],
    spacing: ['2.5'],
  },
  accessibility: [
    'Plain text: no role and no touch target',
    'The part of speech is written, never shown by the dashed outline alone',
  ],
  aiHints: {
    useWhen: ['A word that is not a noun: an adjective, a verb, other'],
    avoidWhen: ['A noun: use ArticleChip with the gender role'],
    invalid: [
      'A gender colour: a word without an article has no gender',
      'A hard-coded label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
