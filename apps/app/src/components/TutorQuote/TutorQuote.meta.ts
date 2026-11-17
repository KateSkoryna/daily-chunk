import type { ComponentMeta } from '../meta';

export const tutorQuoteMeta = {
  name: 'TutorQuote',
  category: 'molecule',
  description:
    'The tutor’s only voice: one short line in a box with a label tab on the top border. It speaks at the start of a lesson, after a pass or a fail, and on streak milestones. The variant only changes the colour and adds a ✓ or ✗ icon; the layout never changes.',
  spec: 'DESIGN.md §9.3, design/system/components/TutorQuote.md',
  props: {
    variant: 'start (yellow), pass (cyan with ✓) or fail (red with ✗)',
    tabLabel:
      'The text on the tab, already translated: the tutor’s name or the result',
    children: 'The tutor’s line, at most 2 short sentences',
    className: 'Extra classes; layout only',
  },
  variants: {
    start: 'Yellow border and tab; the tutor opens a lesson or a milestone',
    pass: 'Cyan border and tab with a ✓ icon',
    fail: 'Red border and tab with a ✗ icon',
  },
  states: ['default'],
  relationships: {
    usedIn: ['Lesson done', 'Read aloud score', 'Lesson start'],
    pairsWith: ['LessonStepper'],
  },
  tokens: {
    color: [
      'primary',
      'primary-foreground',
      'success',
      'destructive',
      'foreground',
    ],
    typography: ['label', 'label-sm'],
    spacing: ['1', '2', '3.5', '6'],
  },
  accessibility: [
    'The tab text and the line are real text, read in that order',
    'Pass and fail are shown by the ✓ or ✗ icon and the tab text, never by colour alone',
    'Not interactive: no touch target',
  ],
  aiHints: {
    useWhen: [
      'Showing a short tutor line at the start of a lesson, after a task result or on a streak milestone',
    ],
    avoidWhen: [
      'Showing an error message or a form hint: use a plain text line',
      'Showing more than 2 short sentences',
    ],
    invalid: [
      'A hard-coded tutor line or tab label: both come from the i18n strings',
      'A pass or fail variant without its icon',
    ],
  },
} satisfies ComponentMeta;
