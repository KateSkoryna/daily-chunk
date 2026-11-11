import type { ComponentMeta } from '../../components/meta';

export const scanlinesMeta = {
  name: 'Scanlines',
  category: 'atom',
  description: 'Draws the faint horizontal lines of the screen ground.',
  spec: 'DESIGN.md §7.6',
  props: {},
  states: ['default'],
  relationships: {
    usedIn: ['Screen'],
  },
  tokens: {
    color: ['foreground'],
  },
  accessibility: ['Decorative: ignores touches and has nothing to read'],
  aiHints: {
    useWhen: ['Once per screen, inside Screen'],
    avoidWhen: [
      'On cards or any other surface: the lines belong to the screen ground',
    ],
    invalid: ['More than one Scanlines on a screen'],
  },
} satisfies ComponentMeta;
