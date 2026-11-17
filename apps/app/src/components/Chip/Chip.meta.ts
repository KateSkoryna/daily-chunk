import type { ComponentMeta } from '../meta';

export const chipMeta = {
  name: 'Chip',
  category: 'atom',
  description:
    'A pressable pink-outlined tile with an optional icon and a short word, for example a word to retry after read aloud. Chips share the width of their row.',
  spec: 'DESIGN.md §9.3, design/screens/Record.dc.html',
  props: {
    label: 'The word on the chip',
    icon: 'An optional icon before the word, drawn in pink',
    onPress: 'Called when the chip is pressed',
    accessibilityLabel: 'Name that says what a press does, from i18n',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon', 'Text'],
    pairsWith: ['RecordButton', 'TutorQuote'],
    usedIn: ['Read aloud (words to retry)'],
    alternatives: {
      Button: 'The main action of a screen is a Button',
      ArticleChip: 'Showing a noun’s gender is an ArticleChip',
    },
  },
  tokens: {
    color: ['highlight', 'card'],
    typography: ['option'],
    spacing: ['2'],
    other: ['control'],
  },
  accessibility: [
    'A button; give it an accessibility label that says the action, such as Retry plus the word',
    'The pink border and the icon are decoration; the word is the content',
  ],
  aiHints: {
    useWhen: ['A short tappable word with an action, in a row of 2 or 3'],
    avoidWhen: [
      'The main action of a screen: use a Button',
      'A tag that only shows information',
    ],
    invalid: [
      'A chip without an action',
      'Long text: the label is one short word',
    ],
  },
} satisfies ComponentMeta;
