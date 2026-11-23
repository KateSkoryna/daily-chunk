import type { ComponentMeta } from '../meta';

export const tipCardMeta = {
  name: 'TipCard',
  category: 'molecule',
  description:
    'The small card that opens as a popover over the flashcard, under its lamp, when the lamp is pressed: a lamp, the label Good to know and a short tip in the native language. Cyan border, popover background and a hard shadow.',
  spec: 'DESIGN.md §9.3',
  props: {
    tip: 'The tip text in the native language',
  },
  states: ['default'],
  relationships: {
    composedOf: ['HardShadow', 'Icon'],
    pairsWith: ['TipButton'],
    usedIn: ['FlashcardsScreen'],
  },
  tokens: {
    color: ['popover', 'ring'],
    typography: ['caption', 'body-sm'],
    spacing: ['3', '2.5'],
  },
  accessibility: [
    'A group named Good to know',
    'The lamp is decorative: the label says the same in words',
  ],
  aiHints: {
    useWhen: ['Showing a short tip about a word after its lamp is pressed'],
    avoidWhen: [
      'The meaning of a word: that is the WordPopover',
      'A modal choice: use an alert dialog',
    ],
    invalid: [
      'Hard-coded text: the tip comes from the word data and the label from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
