import type { ComponentMeta } from '../meta';

export const lessonStepperMeta = {
  name: 'LessonStepper',
  category: 'molecule',
  description:
    'Shows where the person is in a lesson: one segment per task, a label for the current task and the XP earned so far. Done segments are green, the current one is yellow, upcoming ones are dim. The Boss round uses the same component with 3 segments.',
  spec: 'DESIGN.md §9.3, design/system/components/LessonStepper.md',
  props: {
    total:
      'How many segments to draw: 6 for a lesson, 3 for the parts of a Boss round',
    current: 'The position of the current task, counting from 1',
    label:
      'Text above the segments, already translated, for example the task number and name',
    xpLabel: 'The XP earned so far, already translated, shown on the right',
    className: 'Extra classes; layout only',
  },
  states: ['default'],
  relationships: {
    usedIn: ['Lesson task screens', 'Boss round'],
    pairsWith: ['TutorQuote'],
  },
  tokens: {
    color: ['success', 'primary', 'popover', 'highlight', 'muted-foreground'],
    typography: ['label-sm'],
    spacing: ['1', '2'],
    other: ['segment'],
  },
  accessibility: [
    'The segments are a progressbar with the label as its name and the current position as its value',
    'Progress is shown by position and by the label text, not by colour alone',
    'Not interactive: no touch target',
  ],
  aiHints: {
    useWhen: [
      'Showing progress through the tasks of a lesson or the parts of a Boss round',
    ],
    avoidWhen: [
      'Showing a percentage or a score: use a stat tile',
      'Showing a long list of steps: it is built for 6 segments or fewer',
    ],
    invalid: [
      'A current position below 1 or above total',
      'A hard-coded label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
