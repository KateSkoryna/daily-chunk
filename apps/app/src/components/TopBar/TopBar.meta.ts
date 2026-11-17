import type { ComponentMeta } from '../meta';

export const topBarMeta = {
  name: 'TopBar',
  category: 'molecule',
  description:
    'The row at the top of a screen: something on the left (menu, close or back) and something on the right (stats, a counter or a label). TopBar.Button is the square icon button for menu and close.',
  spec: 'DESIGN.md §9.3, plan.md §5 (TopBar)',
  props: {
    left: 'What sits on the left, usually a TopBar.Button',
    right: 'What sits on the right, such as HeaderStats or a counter',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    composedOf: ['PressableFocus', 'Icon'],
    pairsWith: ['HeaderStats', 'LessonStepper'],
    usedIn: ['Home', 'Lesson task screens', 'Boss round'],
  },
  tokens: {
    color: ['input', 'foreground'],
    other: ['touch'],
  },
  accessibility: [
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
      'More than one primary action in the bar',
    ],
  },
} satisfies ComponentMeta;
