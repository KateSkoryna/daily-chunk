import type { ComponentMeta } from '../meta';

export const lessonHeaderMeta = {
  name: 'LessonHeader',
  category: 'molecule',
  description:
    'The top of every lesson task screen: a control on the left (back to the previous part of the lesson), the lesson name in the middle, a control on the right (quit the lesson), and under them the stepper with the task name and the XP so far.',
  spec: 'DESIGN.md §9.3, design/screens/Flashcards.dc.html, Listen.dc.html',
  props: {
    left: 'Optional. The control on the left: a ghost Button with a back icon that goes to the previous part of the lesson. Leave it out on the first task',
    right:
      'Optional. The control on the right: the quit button (a ghost Button with a cross), or another control such as the translation toggle of the Read screen',
    lessonLabel:
      'The lesson name in the middle, already translated, for example Lesson 13',
    stepLabel: 'The task name above the stepper, already translated',
    xpLabel: 'The XP earned so far, already translated',
    stepCount: 'How many tasks the lesson has',
    currentStep: 'The current task, counting from 1',
    stepNames:
      'The names of the six tasks, already translated; they name the stepper segments when onStepSelect is given',
    onStepSelect:
      'Optional. Called with the tapped task (from 1); makes the stepper segments buttons that jump to that task',
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
    typography: ['label'],
    spacing: ['4'],
  },
  accessibility: [
    'The left and right controls have accessible names from i18n',
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
