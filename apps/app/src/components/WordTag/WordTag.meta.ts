import type { ComponentMeta } from '../meta';

export const wordTagMeta = {
  name: 'WordTag',
  category: 'atom',
  description:
    'The tag at the start of a word row: the article chip in the gender colour for a word with a gender, the grey dashed part-of-speech chip for any other word. It picks the right one from the word, so a screen never decides it.',
  spec: 'DESIGN.md §9.3 (ArticleChip, PartOfSpeechChip)',
  props: {
    word: 'The word; its gender or part of speech decides the tag',
    className: 'Extra classes; layout only, such as a minimum width',
  },
  states: ['article', 'part of speech'],
  relationships: {
    composedOf: ['ArticleChip', 'PartOfSpeechChip'],
    usedIn: ['Confirm', 'Translate (the words to use)', 'Lesson done'],
  },
  tokens: {
    color: ['gender-masc', 'gender-fem', 'gender-neut', 'muted-foreground'],
    typography: ['chip'],
    spacing: ['2.5'],
  },
  accessibility: [
    'Plain text: no role and no touch target',
    'The article or the part of speech is written, never shown by colour alone',
  ],
  aiHints: {
    useWhen: ['The first element of a row that lists words'],
    avoidWhen: ['A tag for a fixed gender role with no word: use ArticleChip'],
    invalid: ['Hard-coded tag text: it comes from the word and i18n'],
  },
} satisfies ComponentMeta;
