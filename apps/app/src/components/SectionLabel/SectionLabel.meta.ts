import type { ComponentMeta } from '../meta';

export const sectionLabelMeta = {
  name: 'SectionLabel',
  category: 'atom',
  description:
    'The pink uppercase title of a block on a screen, such as "01 / ADD TODAY’S WORDS". It is the label text style marked as a heading for screen readers.',
  spec: 'DESIGN.md §5.2 (label), CLAUDE.md design rules',
  props: {
    children: 'The label text, already translated',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text'],
    usedIn: ['Home', 'Lesson task screens', 'Review', 'Word bank'],
  },
  tokens: {
    color: ['highlight'],
    typography: ['label'],
  },
  accessibility: [
    'Exposed as a heading so screen readers can jump between sections',
  ],
  aiHints: {
    useWhen: ['Titling a block of a screen'],
    avoidWhen: [
      'A screen title: use Text display-l',
      'A short stepper or tutor label: those use label-sm',
    ],
    invalid: ['A colour override: section labels are always pink'],
  },
} satisfies ComponentMeta;
