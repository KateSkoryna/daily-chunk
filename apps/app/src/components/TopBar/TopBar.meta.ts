import type { ComponentMeta } from '../meta';

export const topBarMeta = {
  name: 'TopBar',
  category: 'molecule',
  description:
    'The row at the top of a screen: something on the left (menu, close or back) and something on the right (stats, a counter or a label). TopBar.Action is a ghost button with an icon and a visible word (Menu, Quit lesson) for the corner action. TopBar.Button is the square icon-only button, for a control whose meaning is obvious from its place (the dictate button, the close button of the menu).',
  spec: 'DESIGN.md §9.3, plan.md §5 (TopBar)',
  props: {
    left: 'What sits on the left, usually a TopBar.Button',
    center: 'What sits in the middle, such as the LogoBadge on Home',
    right: 'What sits on the right, such as HeaderStats or a counter',
    className: 'Extra classes; layout only',
    'Action icon and label':
      'The icon and the visible word of TopBar.Action; the word is also its accessible name',
    'Action iconPosition':
      'start (icon before the word, the default) or end (icon after the word, for Quit on the right)',
    'Button variant':
      'default (grey border), record (pink border, for dictating or recording) or tip (cyan border and icon, for a hint such as the crossword lamp)',
    'Button disabled':
      'True when the button cannot be used now (a hint already shown): muted border and icon, not pressable',
  },
  states: ['default', 'disabled'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon', 'Button'],
    pairsWith: ['HeaderStats', 'LessonStepper'],
    usedIn: ['Home', 'Lesson task screens', 'Boss round'],
  },
  tokens: {
    color: [
      'input',
      'foreground',
      'highlight',
      'background',
      'ring',
      'border',
      'muted-foreground',
    ],
    other: ['touch'],
  },
  accessibility: [
    'TopBar.Action shows its word next to the icon; the word is the accessible name',
    'TopBar.Button is a button with a required accessibility label from i18n',
    'The button is at least 3rem square',
  ],
  aiHints: {
    useWhen: [
      'The first row of a screen with an action on one side and info on the other',
    ],
    avoidWhen: ['Navigating between the main sections: use the TabBar'],
    invalid: [
      'A TopBar.Button without an accessibility label',
      'An icon-only corner action for the menu or for leaving a lesson: use TopBar.Action',
      'More than one primary action in the bar',
    ],
  },
} satisfies ComponentMeta;
