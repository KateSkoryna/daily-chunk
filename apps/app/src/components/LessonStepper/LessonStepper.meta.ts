import type { ComponentMeta } from '../meta';

export const lessonStepperMeta = {
  name: 'LessonStepper',
  category: 'molecule',
  description:
    'Shows where the person is in a lesson: one segment per task, a label for the current task and the XP earned so far. Done segments are cyan, the current one is yellow, upcoming ones are dim. The Boss round uses the same component with 3 segments.',
  spec: 'DESIGN.md §9.3, design/system/components/LessonStepper.md',
  props: {
    variant:
      'lesson (default): the current task is yellow. progress: the count of finished steps, such as lessons toward the Boss round; none is yellow',
    total:
      'How many segments to draw: 6 for a lesson, 3 for the parts of a Boss round',
    current:
      'The position of the current task, counting from 1; in the progress variant the number of finished steps, from 0',
    label:
      'Text above the segments, already translated, for example the task number and name',
    xpLabel: 'The XP earned so far, already translated, shown on the right',
    segmentLabels:
      'Optional. The accessible name of each segment (the task name), already translated; used when onSelect is given',
    onSelect:
      'Optional. Called with the tapped segment (from 1); the segments become buttons with a 3rem touch area. Leave it out to only show progress',
    className: 'Extra classes; layout only',
  },
  variants: {
    lesson: 'Done cyan, current yellow, upcoming dim',
    progress: 'Finished cyan, the rest dim',
  },
  states: ['default'],
  relationships: {
    usedIn: [
      'Lesson task screens',
      'Boss round',
      'Home (progress to the Boss round)',
      'Lesson done',
    ],
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
    'Without onSelect: not interactive, no touch target',
    'With onSelect: a toolbar of buttons, one per task, each named by its task; the current one is marked as the current step',
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
      'A current position below 1 or above total (in the lesson variant)',
      'A hard-coded label: it comes from the i18n strings',
    ],
  },
} satisfies ComponentMeta;
