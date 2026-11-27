import type { ComponentMeta } from '../meta';

export const stepIndicatorMeta = {
  name: 'StepIndicator',
  category: 'molecule',
  description:
    'Shows the parts of one task, such as 1 · Listen and 2 · Repeat. The current part has a dim fill and a yellow label; the others are muted. Without `onSelect` it only shows where you are. With `onSelect` the parts are tabs: tapping one switches to it.',
  spec: 'DESIGN.md §9.3, design/screens/Listen.dc.html',
  props: {
    steps:
      'The names of the parts, already translated; the number is added by the component',
    current: 'The current part, counting from 1',
    label: 'The accessible name of the group, already translated',
    onSelect:
      'Optional. Called with the tapped part (from 1); makes the parts tabs. Leave it out to only show progress',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['LessonStepper', 'Waveform'],
    usedIn: ['Listen & shadow'],
    alternatives: {
      LessonStepper: 'Progress through the seven tasks of a lesson',
    },
  },
  tokens: {
    color: ['border', 'popover', 'primary', 'muted-foreground'],
    typography: ['ui'],
    other: ['touch'],
  },
  accessibility: [
    'A progressbar named by label, with the current part as its value',
    'The current part is shown by its number and fill, and the number is written in the text',
    'Without onSelect: not interactive, no touch target',
    'With onSelect: a tablist, each part is a tab with its selected state and at least 3rem tall',
  ],
  aiHints: {
    useWhen: [
      'A task that has 2 or 3 parts done in order',
      'A task whose 2 or 3 parts the person switches between (pass onSelect)',
    ],
    avoidWhen: ['Progress through the lesson: use LessonStepper'],
    invalid: [
      'A current position below 1 or above the number of steps',
      'Hard-coded step names: they come from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
