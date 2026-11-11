import type { ComponentMeta } from '../meta';

export const screenMeta = {
  name: 'Screen',
  category: 'molecule',
  description:
    'The ground of a page: background, scanlines and the screen padding.',
  spec: 'DESIGN.md §6, §7.6, §8',
  props: {
    className: 'Extra classes for the content area; layout only',
    children: 'The content of the screen',
  },
  states: ['default'],
  relationships: {
    composedOf: ['Scanlines'],
    usedIn: ['Every screen'],
  },
  tokens: {
    color: ['background'],
    spacing: [
      'screen-top',
      'gutter',
      'screen-bottom',
      'gutter-tablet',
      'gutter-desktop',
      '16',
    ],
  },
  accessibility: ['A plain container with no role of its own'],
  aiHints: {
    useWhen: ['As the root of every screen'],
    avoidWhen: [
      'Inside another Screen or on a card: the scanlines go once per screen',
    ],
    invalid: ['Screen padding or scanlines written by hand in a screen'],
  },
} satisfies ComponentMeta;
