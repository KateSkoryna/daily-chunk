import type { ComponentMeta } from '../meta';

export const statTileMeta = {
  name: 'StatTile',
  category: 'atom',
  description:
    'A big number with a small label, used in rows of three at the end of a lesson. The primary tile is filled yellow with a hard shadow; the others are outlined in cyan or pink.',
  spec: 'DESIGN.md §9.3, design/screens/Done.dc.html',
  props: {
    variant:
      'primary (yellow fill), success (cyan outline) or highlight (pink outline)',
    value: 'The number, as text (for example +140 or 88%)',
    label: 'The label under the number, already translated',
    className: 'Extra classes; layout only',
  },
  variants: {
    primary: 'Yellow fill, dark text, hard shadow',
    success: 'Cyan outline and text',
    highlight: 'Pink outline and text',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Text', 'HardShadow'],
    usedIn: ['Lesson done', 'Score', 'Stats'],
  },
  tokens: {
    color: ['primary', 'primary-foreground', 'success', 'highlight', 'shadow'],
    typography: ['display-num', 'label-sm'],
    spacing: ['1'],
  },
  accessibility: ['Plain text: the number is read, then its label'],
  aiHints: {
    useWhen: ['Showing 2 or 3 key results side by side'],
    avoidWhen: ['Showing progress through steps: use the LessonStepper'],
    invalid: ['More than one primary tile in a row', 'Hard-coded labels'],
  },
} satisfies ComponentMeta;
