import type { ComponentMeta } from '../meta';

export const wordPopoverMeta = {
  name: 'WordPopover',
  category: 'molecule',
  description:
    'The small card that floats right under a tapped word, as wide as its content: the article tag, the word with its article, the translation and the plural, and a button that plays the word. The border has the colour of the word’s gender role and the card has a hard shadow.',
  spec: 'DESIGN.md §9.3, design/screens/Read.dc.html',
  props: {
    word: 'The word to show',
    nativeLanguage: 'Which translation to show',
    onPlay: 'Called by the play button',
  },
  states: ['default'],
  relationships: {
    composedOf: [
      'ArticleChip',
      'PartOfSpeechChip',
      'HardShadow',
      'PressableFocus',
      'Icon',
    ],
    pairsWith: ['StoryText'],
    usedIn: ['Read'],
  },
  tokens: {
    color: [
      'popover',
      'border',
      'ring',
      'gender-masc',
      'gender-fem',
      'gender-neut',
      'gender-plural',
    ],
    typography: ['option', 'body-sm'],
    spacing: ['3', '2.5'],
  },
  accessibility: [
    'A group named Word: and the word with its article',
    'The play button is named Play and the word, and is at least 3rem square',
    'The gender is written in the tag, not only shown by the border colour',
  ],
  aiHints: {
    useWhen: ['Showing what a word in a text means without leaving the screen'],
    avoidWhen: [
      'Editing a word: use a ListGroup row',
      'A modal choice: use an alert dialog',
    ],
    invalid: [
      'A gender colour for a word without a gender',
      'Hard-coded text: it comes from the word data and the i18n strings',
    ],
  },
} satisfies ComponentMeta;
