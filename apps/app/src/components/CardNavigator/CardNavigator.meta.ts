import type { ComponentMeta } from '../meta';

export const cardNavigatorMeta = {
  name: 'CardNavigator',
  category: 'molecule',
  description:
    'Moves between the cards or phrases of a task around the card it wraps. On the web there is an arrow button on the left and on the right of the card. On a phone there are no small buttons: the card is swiped left for the next one and right for the previous one, and a short hint under it says so. It owns no state.',
  spec: 'DESIGN.md §9.3 (owner request 2026-11-23)',
  props: {
    isFirst:
      'True on the first item: previous is disabled, a right swipe does nothing',
    isLast:
      'True on the last item: next is disabled, a left swipe does nothing',
    previousLabel: 'The accessible name of the left arrow, already translated',
    nextLabel: 'The accessible name of the right arrow, already translated',
    swipeHint:
      'The line under the card on a phone that explains the swipe, already translated',
    onPrevious: 'Called by the left arrow or a swipe to the right',
    onNext: 'Called by the right arrow or a swipe to the left',
    children: 'The card',
  },
  states: ['web arrows', 'phone swipe'],
  relationships: {
    composedOf: ['ArrowButton'],
    pairsWith: ['WordCard', 'ItemDots'],
    usedIn: ['Flashcards', 'Listen & shadow'],
  },
  tokens: {
    color: ['muted-foreground'],
    typography: ['caption'],
    spacing: ['2'],
  },
  accessibility: [
    'A swipe is never the only way: ItemDots on the same screen are buttons that jump to any item',
    'The swipe is explained in words under the card',
    'The arrows on the web are buttons with accessible names',
  ],
  aiHints: {
    useWhen: ['Moving between the items of a task around a card'],
    avoidWhen: ['Moving to another section: use a Button with a visible word'],
    invalid: [
      'Small arrow buttons on a phone',
      'Hard-coded labels: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
