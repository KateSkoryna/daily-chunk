import type { ComponentMeta } from '../meta';

export const lessonHeaderMeta = {
  name: 'LessonHeader',
  category: 'molecule',
  description:
    'The top of every lesson task screen: a back or close control on the left, the lesson name on the right, and under them the stepper with the task name and the XP so far.',
  spec: 'DESIGN.md §9.3, design/screens/Flashcards.dc.html, Listen.dc.html',
  props: {
    left: 'The control on the left: a ghost Button with a back or cross icon',
    lessonLabel:
      'The lesson name on the right, already translated, for example Lesson 13',
    stepLabel: 'The task name above the stepper, already translated',
    xpLabel: 'The XP earned so far, already translated',
    stepCount: 'How many tasks the lesson has',
    currentStep: 'The current task, counting from 1',
  },
  states: ['default'],
  relationships: {
    composedOf: ['TopBar', 'LessonStepper'],
    usedIn: [
      'Flashcards',
      'Listen & shadow',
      'Read',
      'Read aloud',
      'Gap fill',
      'Translate',
    ],
  },
  tokens: {
    color: ['muted-foreground'],
    typography: ['ui'],
    spacing: ['4'],
  },
  accessibility: [
    'The left control has an accessible name from i18n',
    'The stepper is a progressbar named by the task name',
  ],
  aiHints: {
    useWhen: ['The first rows of a screen inside a lesson'],
    avoidWhen: ['Tab screens: use TopBar'],
    invalid: [
      'A left control without an accessible name',
      'Hard-coded labels: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
