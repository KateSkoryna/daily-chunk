import type { ComponentMeta } from '../../components/meta';

export const hardShadowMeta = {
  name: 'HardShadow',
  category: 'atom',
  description:
    'Draws the offset block that gives a control its hard shadow, the same way on every platform.',
  spec: 'DESIGN.md §7.4',
  props: {
    className: 'Extra classes for the wrapper; layout only',
    children: 'The element that casts the shadow',
  },
  states: ['default'],
  relationships: {
    usedIn: ['Button', 'WordCard'],
  },
  tokens: {
    color: ['shadow'],
    spacing: ['1'],
    other: ['shadow-hard'],
  },
  accessibility: [
    'Decorative: the block ignores touches and has nothing to read',
  ],
  aiHints: {
    useWhen: ['Primary button and the active flashcard'],
    avoidWhen: [
      'Hero cards that need the larger shadow: only the default offset exists so far',
    ],
    invalid: [
      'shadow-sm and shadow-md classes',
      'Any shadow with blur',
      'Platform shadow props such as elevation',
    ],
  },
} satisfies ComponentMeta;
