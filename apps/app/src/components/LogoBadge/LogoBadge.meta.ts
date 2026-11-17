import type { ComponentMeta } from '../meta';

export const logoBadgeMeta = {
  name: 'LogoBadge',
  category: 'atom',
  description:
    'The app mark: a yellow sheriff star with five dots at its tips, a pink shadow and the letters DC on a dark disc. It is drawn in four stacked layers of plain paths, so every colour comes from a token.',
  spec: 'plan.md D6 (Sheriff badge), design/screens/Logo.dc.html direction B, design/screens/Main.dc.html',
  props: {
    accessibilityLabel: 'The name of the mark for a screen reader, from i18n',
  },
  states: ['default'],
  relationships: {
    pairsWith: ['TopBar', 'HeaderStats'],
    usedIn: ['Home top bar'],
  },
  tokens: {
    color: ['highlight', 'primary', 'background', 'foreground'],
  },
  accessibility: [
    'One image with the accessibility label as its name; the four layers are drawing only',
  ],
  aiHints: {
    useWhen: ['The app mark in the centre of the Home top bar'],
    avoidWhen: [
      'A large logo with the hat and the bubble: that is a different mark',
    ],
    invalid: ['A different size or colour: the mark is fixed'],
  },
} satisfies ComponentMeta;
