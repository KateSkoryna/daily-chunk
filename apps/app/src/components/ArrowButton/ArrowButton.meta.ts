import type { ComponentMeta } from '../meta';

export const arrowButtonMeta = {
  name: 'ArrowButton',
  category: 'atom',
  description:
    'A square secondary button with only an arrow, pointing left (previous) or right (next). It sits on the left and right side of a card to move to the previous or next word or phrase. It is disabled on the first and the last item.',
  spec: 'DESIGN.md §9.3',
  props: {
    direction:
      'previous (arrow to the left) or next (arrow to the right); the screen puts it on that side of the card',
    label:
      'The accessible name, already translated, for example Previous card; there is no visible text',
    disabled: 'True on the first item for previous and on the last for next',
    onPress: 'Called when the button is pressed',
  },
  states: ['default', 'disabled'],
  relationships: {
    composedOf: ['Button', 'Icon'],
    pairsWith: ['WordCard', 'ItemDots'],
    usedIn: ['Flashcards', 'Listen & shadow'],
    alternatives: {
      Button: 'Anything that needs a visible word, such as Next section',
    },
  },
  tokens: {
    color: ['ring', 'popover', 'muted-foreground'],
    other: ['touch'],
  },
  accessibility: [
    'A button named by label; the arrow is decorative',
    'At least 3rem square with the focus ring',
    'The disabled state is announced and is also shown by a dim fill',
  ],
  aiHints: {
    useWhen: ['Moving between the items of a task next to the card'],
    avoidWhen: ['Moving to another section: use a Button with a visible word'],
    invalid: [
      'Hard-coded labels: they come from the i18n strings',
      'Putting both arrows on the same side of the card',
    ],
  },
} satisfies ComponentMeta;
