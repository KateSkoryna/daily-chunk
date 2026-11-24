import type { ComponentMeta } from '../meta';

export const tipButtonMeta = {
  name: 'TipButton',
  category: 'atom',
  description:
    'A square lamp button that marks something interesting to know about a word. It has no border: only the lamp in cyan while the tip is closed, and the lamp on a cyan square while it is open. It sits next to the thing it belongs to, never inside a pressable surface.',
  spec: 'DESIGN.md §9.3',
  props: {
    word: 'The word the tip is about, for the accessible name',
    isOpen: 'Whether the tip card is open',
    onToggle: 'Called when the button is pressed',
    className: 'Position classes from the parent, for example the corner',
  },
  states: ['closed', 'open', 'focused'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon'],
    pairsWith: ['TipCard'],
    usedIn: ['FlashcardsScreen'],
  },
  tokens: {
    color: ['ring', 'background'],
  },
  accessibility: [
    'A button named Good to know about and the word',
    'aria-expanded says whether the tip is open',
    'At least 3rem square',
  ],
  aiHints: {
    useWhen: ['A word has a short tip the learner may want to read'],
    avoidWhen: [
      'Answer feedback: that uses the correct and wrong marks',
      'The word has no tip: show nothing',
    ],
    invalid: [
      'Placing it inside a pressable card: it would flip or press the card',
      'Showing it only on hover: phones have no hover',
    ],
  },
} satisfies ComponentMeta;
